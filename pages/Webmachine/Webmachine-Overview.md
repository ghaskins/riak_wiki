Webmachine is not much like the web frameworks you're used to. You can
call Webmachine a REST toolkit if you like, and we won't argue with
you. Webmachine is an application layer that adds HTTP semantic
awareness on top of the excellent bit-pushing and HTTP
syntax-management provided by
[[mochiweb|http://github.com/basho/mochiweb/]], and provides a simple
and clean way to connect that to your application's behavior.

A Webmachine application is a set of resources, each of which is a set
of [[functions|Webmachine Resource]] over the state of the
resource. We really mean functions here, not object-methods,
infinite-server-loops, or any other such construction. This aspect of
Webmachine is one of the reasons why Webmachine applications are
relatively easy to understand and extend.

These functions give you a place to define the representations and
other Web-relevant properties of your application's resources -- with
the emphasis that the first-class things on the Web are resources and
that their essential properties of interaction are already quite well
defined and usefully constrained.

For most Webmachine applications, most of the functions are quite
small and isolated. One of the nice effects of this is that a quick
reading of a resource will give you an understanding of the
application, its Web behavior, and the relationship between
them. Since these functions are usually [[referentially
transparent|Webmachine Referential Transparency]], Webmachine
applications can be quite easy to test. There's no need for mock
objects, fake database connections, or any other wastes of time when
you can write tests against each component of your application in
terms of the input and output to various functions.

We believe that by giving Web developers a
[[system|Webmachine Mechanics]] with conventions that [[directly map
to HTTP|Webmachine Diagram]] and REST, we help them to write and
extend Web applications quickly while not dictating the shape of the
rest of their application. The resulting applications are
straightforward to examine and maintain, and have very easily
understood HTTP semantics.

<div class="info">
<div class="title">Additional Reading</div>

In addition to the documentation on this site and the source code on
github, some useful Webmachine writing can be found on blogs and
elsewhere. A small sampling of these is here:

<ul>

<li>The [[restful way blog|http://blog.restfulway.com]] is almost
entirely dedicated to Webmachine.</li>


<li>The [[BeerRiot blog|http://blog.beerriot.com]] contains multiple
topics, including a wealth of examples and discussion of
Webmachine.</li>

<li>The blog of [[Andy Gross|http://blog.argv0.net]] has some useful
hints and tutorials.</li>

<li>Paul Mineiro posted about [[dynamically loading Webmachine
resources|http://dukesoferl.blogspot.com/2009/08/dynamically-loading-webmachine.html]].</li>

<li>[[Kevin Smith|http://weblog.hypotheticalabs.com/?page_id=413]]
teaches an excellent Erlang training class which often culminates with
development of applications in Webmachine.</li>

<li>There is a [[mailing
list|http://lists.therestfulway.com/mailman/listinfo/webmachine_lists.therestfulway.com]]
for technical discussion of Webmachine.</li>

</ul>

</div>
