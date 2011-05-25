## How does this Webmachine thing work, anyway?

This page describes the basic mechanics of Webmachine from the point
of view of a single incoming HTTP Request, documenting the behavior of
Webmachine through to the HTTP Response.

<div class="info">
This is a bit different from what you might get with a "Web
Framework" as we're not going to talk about MVC, ORMs, or anything
else about the rest of the shape of your application. We believe that
you know better than we do how to structure your own app --
Webmachine's job is to help you make sure that your app's presence on
the Web is well-behaved and well-structured.
</div>

## Dispatch

When a request is initially received by Webmachine it is handled by
the [[dispatcher|Webmachine Dispatching]]. If the dispatcher
does not find a matching resource then it will immediately respond
with a `404 Not Found`. If a match is found then a [[request data
record|Webmachine Request]] is created and the matching
resource is kicked off via its `init/1` function.

## Decision Core

The resource then flows through the decision core, which is
effectively just running the request through the [[HTTP
flowchart|Webmachine Diagram]]. At each decision point (diamond) in
the diagram, Webmachine will determine which path to follow. In some
cases it can determine the path purely from the request data -- for
instance, the path from decision C3 depends purely on whether the
client sent an Accept header. In many cases, however, the decision is
application-specific -- the path from B10 depends on the value the
[[resource|Webmachine Resource]] module returns from
`allowed_methods`. Eventually the chosen path will terminate at one of
the rectangles on the diagram. At that point Webmachine will send an
appropriate HTTP response, with the headers and body dependent on the
path through the diagram and the values returned by the resource's
functions.

Most of the time you don't need to worry about this big diagram,
though -- just define the [[resource
functions|Webmachine Resource]] relevant to your app and Webmachine
will do the rest. A good understanding of this central mechanism in
Webmachine is most useful when [[debugging your
resources|Webmachine Debugging]].

From the way that Webmachine's decision core works, it follows that
Webmachine's HTTP behavior is transactional. Each HTTP Request is
fully received, and the resulting HTTP Response is then fully
constructed before being returned. This means that while Webmachine is
suitable for a great many Web applications it is not a good fit for an
application that will gradually or continuously stream responses back
to clients inside the context of a single HTTP Request.

## Writing Resources

A useful way to build Webmachine applications is often just to write a
single function such as `to_html` to provide the most basic of stubs;
when that function exists (or any other returned by
`content_types_provided`) you can produce `200 OK` responses. After
that, you can easily extend your application's Web behavior simply by
filling in the other [[resource functions|Webmachine Resource]] as
desired.
