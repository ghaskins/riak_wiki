An introduction to eventual consistency and what it means in terms of handling data with Riak.

<div id="toc"></div>

In a distributed and fault-tolerant environment like Riak, the
unexpected is expected. That means that nodes may leave and join the
cluster at any time, be it by accident (node failure, network
partition, etc.) or on purpose, e.g. by explicitly removing a node
from a Riak cluster. But even with one or more nodes down, the cluster
is still expected to accept writes and serve reads, and the system is
expected to return the same data from all nodes eventually, even the
failed ones after they rejoined the cluster.

## A simple example of eventual consistency

This basis for a simple example is a Riak cluster with five nodes and
a default quorum of 3. That means every piece of data exists three
times in this cluster. In this setup reads use a quorum of 2 to ensure
at least two copies, whereas writes also use a quorum of 2 to enforce
full consistency. Remember that R + W > N ensures full consistency in
a cluster.

When data is written with a quorum of 2, Riak sends the write request
to all three replicas anyway, but returns a successful reply when two
of them acknowledged a successful write on their end. One node may
even have been down, not acknowledging the write.

The purpose of this list of examples is to describe how the replica
node that just failed gets its data back, so that at some undetermined
point in the future, all replicas of a piece of data will be
up-to-date. There are ways of controlling when a specific piece of
data is consistent across all its replicas, but either way, the data
will eventually be consistent on all of them.

Most of these scenarios are easy enough to reproduce. Most of the time
you just need to determine the preference list for a key on a healthy
cluster, take down X nodes and try a combination of read and write
requests to see what happens in each case. It's also good to keep an
eye on the logs to find out when hinted handoffs occur.

## Anatomy of a Riak Request

To understand how eventual consistency is handled in a Riak
environment, it's important to know how a request is handled
internally.  There's not much magic involved, but helps understand
things like read repair, and how the quorum is handled in read and
write requests. Be sure to read the wiki page on
[[Replication|Replication#Understanding-replication-by-example]] first, it has all
the details on how data is replicated across nodes and what happens
when a node becomes unavailable for read and write requests, the
basics for how eventual consistency is handled in Riak.

Recall that every key belongs to N primary virtual nodes and a number
of secondary nodes. Primary nodes are the ones that are physically
responsible for vnode at a given time. Secondaries are fallback nodes,
they're logically close to the primaries in the key space, and they're
the nodes to go to should a primary become unavailable.

The basic steps of a request in Riak are the following:

* Determine the nodes responsible for the key from the preference list
* Send a request to all the nodes determined in the previous step
* Wait until enough requests returned the data to fulfill the read
  quorum (if specified) or the basic quorum
* Return the value to the client

The steps are similar for both read and write requests, with some
details different, we'll go into the differences in the examples
below.

In our example cluster, we'll assume that it's healthy and all nodes
are available, that means sending requests to three replicas of the
key requested.

## Failure Scenarios

Now we'll go through a bunch of failure scenarios that could result in
data inconsistencies, and we'll explore how they're resolved. Every
scenario assumes a healthy cluster to begin with, where all nodes are
available.

In a typical failure scenario, at least one node goes down, leaving
two replicas intact in the cluster. Clients can expect that reads with
an R of 2 will still succeed, until the third replica comes back up
again. It's up to the application's details to implement some sort of
graceful degradation in an automated fashion or as a feature flip that
can be tuned at runtime accordingly, or to simply retry when a piece
of data is expected to be found, but a first request returns a
not_found.

### Reading When One Primary Fails

* Data is written to a key with W=3
* One node goes down, it happens to be a primary for that key
* Data is read from that key with R=3
* Riak returns not_found on first request
* Read repair ensures data is replicated to a secondary node
* Subsequent reads return correct value with R=3, two values coming
  from primary and one from secondary nodes

### Reading When Two Primaries Fail

* Data is written to a key with W=3
* Two nodes go down, they happen to be primaries for that key
* Data is read from that key with R=3
* Riak returns not_found on first request
* Read repair ensures data is replicated to secondary nodes, one value
  coming from the remaining primary, two coming from secondaries

Similar scenario to the above, but initial read consistency
expectations may degrade even further, leaving only one initial
replica.

### Edge Case: Reading With R=1 When Two Primaries Fail

When two primaries go down, leaving only one replica, and clients read
using an R value of 1, something that may be unexpected and even
confusing happens. The current implementation of get in Riak involves
a mechanism called basic quorum. The basic quorum assumes that if a
majority of nodes return that an object wasn't found, then the node
coordinating the request assumes the object doesn't exist, even if one
node would have the data available.

Just like above, subsequent requests would yield the expected results,
as read repair ensured that the data now resides on two secondary
nodes.

<div class="note"><div class="title">Basic Quorum</div>Basic quorum requires the majority of nodes to return a `not_found` for a request to be successful. The simple minority is enough, and is calculated using @truncate(N / 2.0 + 1)@, so for an N value of 3 at least 2 nodes must return a value for a successful request

The potential for confusion around the basic quorum has been addressed
in the
[current development of Riak](https://issues.basho.com/show_bug.cgi?id=992),
and the next major release will include an option to disable the basic
quorum for a specific request.</div>

### Reading When Three Primaries Fail

* Data is written to a key with W=3
* All primary nodes responsible for the key go down
* Data is read using R=3 (or any quorum)

This incident will always yield a not found error, as no node is able
to serve the request.

### Writing And Reading When One Primary Failed

* One primary goes down
* Data is written with W=3
* A secondary takes reponsibility for the write
* Reads with R=3 will immediately yield the desired result, as the
  secondary node can satisfy the default quorum

### Writing And Reading When One Primary Failed and Later Recovered

* One primary goes down
* Data is written with W=3
* A secondary takes responsibility for the write
* The primary comes back up
* Within a default timeframe of 60 seconds, hinted handoff will occur,
  transferring the updated data to the primary
* After handoff occurred, the node can successfully serve requests

### Edge Case: Writing And Reading During Hand-off

This is an extension of the previous scenario. The primary has
recovered from failure and re-joined the cluster. As hinted handoff
kicks in, the node has already re-claimed its position in the
ring. Should the new node already be hit with requests during the
hand-off it's likely to return not_founds for data that has been
written to a secondary during its unavailability.

This is a known issue in Riak, and a solution for it is already in the
works.

As a workaround, during the handover the application could e.g. reduce
the quorum used for reads and writes to make up for currently
recovering node until data has been fully handed off between
secondaries and the new node.

### Writing And Reading When Two Primaries Failed and One Recovers

Similar to just one primary failing. When one primary recovers either
hinted handoff or read repair kick in to ensure a following read with
the default quorum can be served successfully. Same happens when the
second failed primary comes back up again.

## Further Reading

* Werner Vogels, et. al.: [Eventually Consistent -  Revisited](http://www.allthingsdistributed.com/2008/12/eventually_consistent.html)
* Ryan Zezeski:
[Riak Core, First Multinode](https://github.com/rzezeski/try-try-try/tree/master/2011/riak-core-first-multinode),
"[Riak Core, The vnode](https://github.com/rzezeski/try-try-try/tree/master/2011/riak-core-the-vnode,)
[Riak Core, The Coordinator](https://github.com/rzezeski/try-try-try/tree/master/2011/riak-core-the-coordinator)
