# The Riak Wiki

This repo holds all the content (and other bits) for the most-excellent Riak wiki, located at [wiki.basho.com](http://wiki.basho.com).

We are using [Gollum](https://github.com/github/gollum) and [Gollum-Site](https://github.com/dreverri/gollum-site) to generate the wiki. Gollum is a great piece of open source software released by the GitHub team that lets you maintain and build wikis from the contents of a Git repo.

Gollum-Site generates html from pages written in any format supported by Gollum (ASCIIDoc, Creole, Markdown, Textile, etc.).

## How to Contribute

Part of the reason we switched to Gollum and GitHub for the Riak Wiki was to make it easier for people to contribute. So, treat this repo much like you would a code repo: If you have a change (be a minor edit or an entirely new page full of Python client code snippets), simply:

1. Fork this repo
2. Add your changes
3. Send us a pull request

If it's a small or obvious change, we'll most-likely merge it ASAP. If we have questions about your edits, we'll get in touch.

The Gollum [README](https://github.com/github/gollum/blob/master/README.md) provides a great introduction to using the wiki system.

*Anyone can contribute to the Riak Wiki via the process outlined above. That said, there is a group of non-Basho developers who have commit access to this repo and can edit it directly. We call them _Community Wiki Committers_. If you're interested in becoming one, [read more here](http://wiki.basho.com/Contributing-to-the-Riak-Wiki.html).*

## Building the Wiki Locally

If you want to build and view the Riak Wiki locally, here is what you need to do:

1. Install [Gollum](https://github.com/github/gollum)

   `gem install gollum`

2. Install [Gollum Site](https://github.com/dreverri/gollum-site)

   `gem install gollum-site`

3. `gem install rdiscount RedCloth` (This will handle the Markdown and Textile support.)

4. Clone the Riak wiki

   `git clone git://github.com/basho/riak_wiki.git`

5. Generate the site and start a local server (This will take a minute. Don't fret.)

   `gollum-site generate && gollum-site serve`

Then navigate to [http://localhost:8000/](http://localhost:8000/) to access a fully-functional copy of the Riak Wiki.

## Issues, Questions, Comments, Etc.

Email *mark@basho.com* or post a message to the [Riak Mailing List](http://lists.basho.com/mailman/listinfo/riak-users_lists.basho.com) if you have a questions, comments, or some type of issue.



