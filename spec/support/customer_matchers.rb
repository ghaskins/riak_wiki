module CustomMatchers
  class BeWellFormed
    def matches?(files)
      @errors = files.map {|filename|
                  begin
                    [
                      check_for_tabs(filename),
                      excessive_spacing(filename),
                      newline_precedes_eof(filename)
                    ]
                  rescue ArgumentError => e
                    "File #{filename} likely contains binary data. If so, please exclude it via quality_spec.IGNORE" <<
                    "\n Exception => #{e.inspect}"
                  end
                }.flatten.compact

      @errors.empty?
    end

    def failure_message_for_should
      @errors.join("\n")
    end

  private
    def check_for_tabs(filename)
      bad_lines = File.readlines(filename).each_with_index.map do |line, line_no|
                    line_no + 1 if line["\t"] and line !~ /^\s+#.*\s+\n$/
                  end.flatten.compact

      "#{filename} has tab characters on lines #{bad_lines.join(', ')}" if bad_lines.any?
    end

    def excessive_spacing(filename)
      bad_lines = File.readlines(filename).each_with_index.map do |line, line_no|
                    line_no + 1 if line =~ /\s+\n$/ and line !~ /^\s+#.*\s+\n$/
                  end.flatten.compact

      "#{filename} has spaces on the EOL on lines #{bad_lines.join(', ')}" if bad_lines.any?
    end

    def newline_precedes_eof(filename)
      "#{filename} does not have a newline (\\n) before EOF" if File.read(filename) !~ /\n$/
    end
  end

  def be_well_formed
    BeWellFormed.new
  end
end
