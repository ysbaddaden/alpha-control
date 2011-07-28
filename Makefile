YUICOMP = java -jar bin/yuicompressor-2.4.2.jar

SUPPORT_FILES=src/support/function.js \
	src/support/regexp.js \
	src/support/inflector.js \
	src/support/string.js \
	src/support/element.js \
	src/support/color.js \
	src/support/optionable.js \
	src/support/eventable.js \
	src/support/jsonp.js

# src/support/serializer.js

UI_FILES=src/ui/widget.js \
	src/ui/overlay.js \
	src/ui/notification.js \
	src/ui/window.js \
	src/ui/dialog.js \
	src/ui/alert.js \
	src/ui/picker.js \
	src/ui/list_picker.js \
	src/ui/autocompleter.js \
	src/ui/sortable.js

# src/ui/date_picker.js
# src/ui/color_picker.js

RAILS_FILES=src/rails/request.js \
  src/rails/ujs.js

all: support rails ui alpha-control

alpha-control:
	cat $(SUPPORT_FILES) $(RAILS_FILES) $(UI_FILES) > lib/alpha-control.js
	$(YUICOMP) lib/alpha-control.js > lib/alpha-control-compressed.js

support:
	cat $(SUPPORT_FILES) > lib/support.js
	$(YUICOMP) lib/support.js > lib/support-compressed.js

rails:
	cat $(RAILS_FILES) > lib/rails.js
	$(YUICOMP) lib/rails.js > lib/rails-compressed.js

ui:
	cat $(UI_FILES) > lib/ui.js
	$(YUICOMP) lib/ui.js > lib/ui-compressed.js

clean:
	rm -f lib/*.js

