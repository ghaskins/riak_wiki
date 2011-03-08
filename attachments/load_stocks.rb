#!/usr/bin/env ruby
require 'rubygems'
require 'csv'
require 'riak'

client = Riak::Client.new
bucket = client['goog']

quotes = File.readlines('goog.csv')
header = CSV.parse_line quotes.shift

quotes.each do |row|
  data  = CSV.parse_line(row)
  obj   = bucket[p data.first]

  obj.data = Hash[ [header, data].transpose ]
  obj.store
end
