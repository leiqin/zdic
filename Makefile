xpi = zdic-1.0.xpi

build:
	zip -r $(xpi) * -x '*.swp' -x '*.xpi' -x 'Makefile'

clean:
	-rm $(xpi)
