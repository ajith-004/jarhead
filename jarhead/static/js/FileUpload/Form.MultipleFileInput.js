/*
---

name: Form.MultipleFileInput
description: Create a list of files that has to be uploaded
license: MIT-style license.
authors: Arian Stolwijk
requires: [Core/Element.Event, Core/Class, Core/Options, Core/Events]
provides: Form.MultipleFileInput

...
*/

Object.append(Element.NativeEvents, {
	dragenter: 2, dragleave: 2, dragover: 2, dragend: 2, drop: 2
});

if (!this.Form) this.Form = {};

Form.MultipleFileInput = new Class({

	Implements: [Options, Events],

	options: {
		itemClass: 'uploadItem',
		showSize: false/*,
		onAdd: function(file){},
		onRemove: function(file){},
		onEmpty: function(){},
		onDragenter: function(event){},
		onDragleave: function(event){},
		onDragover: function(event){},
		onDrop: function(event){}*/
	},

	_files: [],

	initialize: function(input, list, drop, options){
		input = this.element = document.id(input);
		list = this.list = document.id(list);
		drop = this.drop = document.id(drop);

		this.setOptions(options);

		var name = input.get('name');
		if (name.slice(-2) != '[]') input.set('name', name + '[]');
		input.set('multiple', true);

		this.inputEvents = {
			change: function(event){
				Array.each(input.files, this.add, this);
				this.fireEvent('change', event);
			}.bind(this)
		};

		this.dragEvents = drop && (typeof document.body.draggable != 'undefined') ? {
			dragenter: function(event){
				event.stopPropagation();
				event.preventDefault();
				this.addClass('ondrag');
			},
			dragleave: function(event){
				event.stopPropagation();
				event.preventDefault();
				this.removeClass('ondrag');
			},
			dragend: function(event){
				event.stopPropagation();
				event.preventDefault();
			},
			dragover: function(event){
				event.stopPropagation();
				event.preventDefault();
			},
			drop: function(event){
				event.stopPropagation();
				event.preventDefault();
				var dataTransfer = event.event.dataTransfer;
				if (dataTransfer) Array.each(dataTransfer.files, this.add, this);
				this.fireEvent('drop', event);
			}.bind(this)
		} : null;

		this.attach();
	},

	attach: function(){
		this.element.addEvents(this.inputEvents);
		if (this.dragEvents) this.drop.addEvents(this.dragEvents);
	},

	detach: function(){
		this.input.removeEvents(this.inputEvents);
		if (this.dragEvents) this.drop.removeEvents(this.dragEvents);
	},

	add: function(file){
		this._files.push(file);
		var self = this;
		new Element('li', {
			'class': this.options.itemClass
		}).grab(new Element('span', {
			text: file.name + (self.options.showSize ? " (" + this._format_file_size(file.size) + ")" : "")
		})).grab(new Element('a', {
			text: 'x',
			href: '#',
			events: {click: function(e){
				e.preventDefault();
				self.remove(file);
			}}
		})).inject(this.list);
		this.fireEvent('add', file);
		return this;
	},

	_format_file_size: function(size){
		var suffix = ' KB';
		size /= 1024;
		if (size >= 1024) {
			size /= 1024;
			suffix = ' MB';
		}
		if (size >= 1024) {
			size /= 1024;
			suffix = ' GB';
		}
		return size.toFixed(1) + suffix;
	},

	remove: function(file){
		var index = this._files.indexOf(file);
		if (index == -1) return this;
		this._files.splice(index, 1);
		this.list.childNodes[index].destroy();
		this.fireEvent('remove', file);
		if (!this._files.length) this.fireEvent('empty');
		return this;
	},

	getFiles: function(){
		return this._files;
	}

});
