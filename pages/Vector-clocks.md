With any node able to drive any request, and not all nodes needing to
participate in each request, it is necessary to have a method for
keeping track of which version of a value is current. This is where
vector clocks come in. The vector clocks used in Riak are based on the
[[work of Leslie Lamport|http://portal.acm.org/citation.cfm?id=359563]].

When a value is stored in Riak, it is tagged with a vector clock,
establishing its initial version. For each update, the vector clock is
extended in such a way that Riak can later compare two versions of the
object and determine:

 * Whether one object is a direct descendant of the other.
 * Whether the objects are direct descendants of a common parent.
 * Whether the objects are unrelated in recent heritage.

Using this knowledge, Riak can possibly auto-repair out-of-sync data,
or at least provide a client with an opportunity to reconcile
divergent changesets in an application specific manner.

## Vector Clock Pruning

Riak regularly prunes vector clocks based on four parameters which can
be set per bucket. These parameters are:

 * small_vclock
 * big_vclock
 * young_vclock
 * old_vclock

To understand what these parameters do let's first review the
structure of a vector clock. Vector clocks are a list of updates made
per client id ("X-Riak-ClientId"). For example:

    [{client1, 3},{client2, 1},{client3, 2}]

The above vector clock would indicate that client1 updated the object
3 times, client2 updated the object 1 time, and client3 updated the
object 2 times. Timestamp data is also stored in the vector clock but
omitted from the example for simplicity.

The "small_vclock" and "big_vclock" parameters refer to the length of
the vector clock list. If the length of the list is smaller than
"small_vclock" it will not be pruned. If the length is greater than
"big_vclock" it will be pruned.

[[/attachments/vclock_pruning.png|align=center]]

The "young_vclock" and "old_vclock" parameters refer to the timestamp
per vclock entry. If the list length is between "small_vclock" and
"big_vclock" the age of each entry is checked. If the entry is younger
than "young_vclock" it is not pruned. If the entry is older than
"old_vclock" than it is pruned.

More aggressive vector clock pruning can be achieved by lowering the
values of these four parameters.

## More Information

Additional background information on vector clocks:

 * [[Vector Clocks on Wikipedia|http://en.wikipedia.org/wiki/Vector_clock]]
 * [[Why Vector Clocks are Easy|http://blog.basho.com/2010/01/29/why-vector-clocks-are-easy/]]
 * [[Why Vector Clocks are Hard|http://blog.basho.com/2010/04/05/why-vector-clocks-are-hard/]]
