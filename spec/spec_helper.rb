require 'rspec'

Dir[ Bundler.root.join("spec/support/**/*.rb") ].each{|f| require f}

RSpec.configure do |c|
  c.include CustomMatchers
end
