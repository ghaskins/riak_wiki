#!/usr/bin/env ruby
require 'rubygems'
require 'csv'
require 'riak'

client = Riak::Client.new
bucket = client['goog']

quotes = CSV.read 'goog.csv'
header = quotes.shift

quotes.each do |row|
  obj = bucket[p row.first]

  obj.data = Hash[ [header, row].transpose ]
  obj.store
end
