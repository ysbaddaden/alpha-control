#YUICOMP = java -jar lib/yuicompressor-2.4.2.jar

SUPPORT_FILES=lib/support/function.js \
	lib/support/regexp.js \
	lib/support/inflector.js \
	lib/support/string.js \
	lib/support/element.js \
	lib/support/color.js \
	lib/support/optionable.js \
	lib/support/eventable.js

UI_FILES=lib/ui/widget.js \
	lib/ui/overlay.js \
	lib/ui/notification.js \
	lib/ui/dialog.js \
	lib/ui/modal_dialog.js \
	lib/ui/picker.js \
	lib/ui/list_picker.js

all: support ui alpha-control

alpha-control:
	cat $(SUPPORT_FILES) $(UI_FILES) > build/alpha-control.js
	#$(YUICOMP) build/alpha-control.js > build/alpha-control-compressed.js
	
support:
	cat $(SUPPORT_FILES) > build/support.js
	#$(YUICOMP) build/support.js > build/support-compressed.js

ui:
	cat $(UI_FILES) > build/ui.js
	#$(YUICOMP) build/ui.js > build/ui-compressed.js

clean:
	rm -f build/*.js

