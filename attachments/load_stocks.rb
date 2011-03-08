#!/usr/bin/env ruby
%w[rubygems csv time riak].each{|lib| require lib}

client  = Riak::Client.new # or: Riak::Client.new(:port => 8097)
bucket  = client['goog']

quotes  = CSV.read 'goog.csv'
header  = quotes.shift

quotes.each do |row|
  obj = bucket[p row.first]

  obj.data = Hash[ [header, row].transpose ]
  obj.store
end
