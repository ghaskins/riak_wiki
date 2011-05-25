## Install Erlang

Make sure that you have a working Erlang/OTP release, see [[Installing
Erlang]] for information on getting Erlang setup on your system.

## Get Webmachine

Get the webmachine code:

```bash
git clone git://github.com/basho/webmachine
```

## Create a Skeleton Resource

Create, build, and start the skeleton resource:

```bash
./scripts/new_webmachine.erl mywebdemo /tmp
cd /tmp/mywebdemo
make
./start.sh
```

Point your web browser at [[http://localhost:8000]] and take a look.

## Next Steps

* Define URI paths for the resource by adding more
  [[dispatch|Webmachine Dispatching]] terms in
  `/tmp/mywebdemo/priv/dispatch.conf`; other frameworks refer to these
  as routes.

* Change the [[resource's|Webmachine Resource]] behavior by modifying
  `/tmp/mywebdemo/src/mywebdemo_resource.erl`

* Check out the [[demo application|Webmachine Demo]].
