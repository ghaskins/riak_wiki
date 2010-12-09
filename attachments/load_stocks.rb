#!/usr/bin/env ruby
require 'rubygems'
require 'csv'
require 'riak'

client = Riak::Client.new
bucket = client.bucket('goog', :keys => false)

CSV.foreach('goog.csv', :headers => true) do |row|
  puts row.first[1].to_s
  obj = bucket.new(row.first[1].to_s)
  obj.data = Hash[row.to_a]
  obj.store
end
