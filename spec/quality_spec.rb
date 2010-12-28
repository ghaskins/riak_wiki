require "spec_helper"

IGNORE = /\.(png$|gz$|rbc$|ico$|jpg$|gif$|eps$|logo$|pdf$)/

describe "The application itself" do
  it "has no malformed whitespace" do
    files = `git ls-files`.split("\n").select {|fn| fn !~ IGNORE}

    files.should be_well_formed
  end
end
