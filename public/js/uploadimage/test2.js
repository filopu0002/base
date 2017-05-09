tinymce.PluginManager.add("image", function(editor) {
  /**
   * @param {string} url
   * @param {Function} callback
   * @return {undefined}
   */
  function getImageSize(url, callback) {
    /**
     * @param {number} line
     * @param {number} e
     * @return {undefined}
     */
    function onerror(line, e) {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
      callback({
        width : line,
        height : e
      });
    }
    /** @type {Element} */
    var img = document.createElement("img");
    /**
     * @return {undefined}
     */
    img.onload = function() {
      onerror(Math.max(img.width, img.clientWidth), Math.max(img.height, img.clientHeight));
    };
    /**
     * @return {undefined}
     */
    img.onerror = function() {
      onerror();
    };
    /** @type {(CSSStyleDeclaration|null)} */
    var style = img.style;
    /** @type {string} */
    style.visibility = "hidden";
    /** @type {string} */
    style.position = "fixed";
    /** @type {number} */
    style.bottom = style.left = 0;
    /** @type {string} */
    style.width = style.height = "auto";
    document.body.appendChild(img);
    /** @type {string} */
    img.src = url;
  }
  /**
   * @param {?} content
   * @param {Function} template
   * @param {Array} o
   * @return {?}
   */
  function compile(content, template, o) {
    /**
     * @param {?} lines
     * @param {Array} options
     * @return {?}
     */
    function compile(lines, options) {
      return options = options || [], tinymce.each(lines, function(target) {
        var item = {
          text : target.text || target.title
        };
        if (target.menu) {
          item.menu = compile(target.menu);
        } else {
          item.value = target.value;
          template(item);
        }
        options.push(item);
      }), options;
    }
    return compile(content, o || []);
  }
  /**
   * @param {Function} callback
   * @return {?}
   */
  function createImageList(callback) {
    return function() {
      var opts = editor.settings.image_list;
      if ("string" == typeof opts) {
        tinymce.util.XHR.send({
          url : opts,
          /**
           * @param {?} data
           * @return {undefined}
           */
          success : function(data) {
            callback(tinymce.util.JSON.parse(data));
          }
        });
      } else {
        if ("function" == typeof opts) {
          opts(callback);
        } else {
          callback(opts);
        }
      }
    };
  }
  /**
   * @param {?} content
   * @return {undefined}
   */
  function showDialog(content) {
    /**
     * @return {undefined}
     */
    function recalcSize() {
      var elem;
      var input;
      var newHeight;
      var newWidth;
      elem = element.find("#width")[0];
      input = element.find("#height")[0];
      if (elem) {
        if (input) {
          newHeight = elem.value();
          newWidth = input.value();
          if (element.find("#constrain")[0].checked()) {
            if (height) {
              if (width) {
                if (newHeight) {
                  if (newWidth) {
                    if (height != newHeight) {
                      /** @type {number} */
                      newWidth = Math.round(newHeight / height * newWidth);
                      if (!isNaN(newWidth)) {
                        input.value(newWidth);
                      }
                    } else {
                      /** @type {number} */
                      newHeight = Math.round(newWidth / width * newHeight);
                      if (!isNaN(newHeight)) {
                        elem.value(newHeight);
                      }
                    }
                  }
                }
              }
            }
          }
          height = newHeight;
          width = newWidth;
        }
      }
    }
    /**
     * @return {undefined}
     */
    function onSubmitForm() {
      /**
       * @param {Node} imgElm
       * @return {undefined}
       */
      function waitLoad(imgElm) {
        /**
         * @return {undefined}
         */
        function selectImage() {
          /** @type {null} */
          imgElm.onload = imgElm.onerror = null;
          if (editor.selection) {
            editor.selection.select(imgElm);
            editor.nodeChanged();
          }
        }
        /**
         * @return {undefined}
         */
        imgElm.onload = function() {
          if (!data.width) {
            if (!data.height) {
              if (!!u) {
                dom.setAttribs(imgElm, {
                  width : imgElm.clientWidth,
                  height : imgElm.clientHeight
                });
              }
            }
          }
          selectImage();
        };
        /** @type {function (): undefined} */
        imgElm.onerror = selectImage;
      }
      var el;
      var n;
      updateStyle();
      recalcSize();
      data = tinymce.extend(data, element.toJSON());
      if (!data.alt) {
        /** @type {string} */
        data.alt = "";
      }
      if (!data.title) {
        /** @type {string} */
        data.title = "";
      }
      if ("" === data.width) {
        /** @type {null} */
        data.width = null;
      }
      if ("" === data.height) {
        /** @type {null} */
        data.height = null;
      }
      if (!data.style) {
        /** @type {null} */
        data.style = null;
      }
      data = {
        src : data.src,
        alt : data.alt,
        title : data.title,
        width : data.width,
        height : data.height,
        style : data.style,
        caption : data.caption,
        "class" : data["class"]
      };
      editor.undoManager.transact(function() {
        /**
         * @param {Node} node
         * @return {?}
         */
        function isTextBlock(node) {
          return editor.schema.getTextBlockElements()[node.nodeName];
        }
        if (!data.src) {
          return void(imgElm && (dom.remove(imgElm), editor.focus(), editor.nodeChanged()));
        }
        if ("" === data.title && (data.title = null), imgElm ? dom.setAttribs(imgElm, data) : (data.id = "__mcenew", editor.focus(), editor.selection.setContent(dom.createHTML("img", data)), imgElm = dom.get("__mcenew"), dom.setAttrib(imgElm, "id", null)), editor.editorUpload.uploadImagesAuto(), data.caption === false && (dom.is(imgElm.parentNode, "figure.image") && (el = imgElm.parentNode, dom.insertAfter(imgElm, el), dom.remove(el))), data.caption !== true) {
          waitLoad(imgElm);
        } else {
          if (!dom.is(imgElm.parentNode, "figure.image")) {
            n = imgElm;
            imgElm = imgElm.cloneNode(true);
            el = dom.create("figure", {
              "class" : "image"
            });
            el.appendChild(imgElm);
            el.appendChild(dom.create("figcaption", {
              contentEditable : true
            }, "Caption"));
            /** @type {boolean} */
            el.contentEditable = false;
            var c = dom.getParent(n, isTextBlock);
            if (c) {
              dom.split(c, n, el);
            } else {
              dom.replace(el, n);
            }
            editor.selection.select(el);
          }
        }
      });
    }
    /**
     * @param {(HTMLElement|string)} value
     * @return {?}
     */
    function removePixelSuffix(value) {
      return value && (value = value.replace(/px$/, "")), value;
    }
    /**
     * @param {Object} options
     * @return {undefined}
     */
    function init(options) {
      var value;
      var name;
      var re;
      var ev = options.meta || {};
      if (imageListCtrl) {
        imageListCtrl.value(editor.convertURL(this.value(), "src"));
      }
      tinymce.each(ev, function(val2, k) {
        element.find("#" + k).value(val2);
      });
      if (!ev.width) {
        if (!ev.height) {
          value = editor.convertURL(this.value(), "src");
          name = editor.settings.image_prepend_url;
          /** @type {RegExp} */
          re = new RegExp("^(?:[a-z]+:)?//", "i");
          if (name) {
            if (!re.test(value)) {
              if (value.substring(0, name.length) !== name) {
                value = name + value;
              }
            }
          }
          this.value(value);
          getImageSize(editor.documentBaseURI.toAbsolute(this.value()), function(ev) {
            if (ev.width) {
              if (ev.height) {
                if (u) {
                  height = ev.width;
                  width = ev.height;
                  element.find("#width").value(height);
                  element.find("#height").value(width);
                }
              }
            }
          });
        }
      }
    }
    /**
     * @param {Object} css
     * @return {?}
     */
    function removeComments(css) {
      if (css.margin) {
        var cStyle = css.margin.split(" ");
        switch(cStyle.length) {
          case 1:
            css["margin-top"] = css["margin-top"] || cStyle[0];
            css["margin-right"] = css["margin-right"] || cStyle[0];
            css["margin-bottom"] = css["margin-bottom"] || cStyle[0];
            css["margin-left"] = css["margin-left"] || cStyle[0];
            break;
          case 2:
            css["margin-top"] = css["margin-top"] || cStyle[0];
            css["margin-right"] = css["margin-right"] || cStyle[1];
            css["margin-bottom"] = css["margin-bottom"] || cStyle[0];
            css["margin-left"] = css["margin-left"] || cStyle[1];
            break;
          case 3:
            css["margin-top"] = css["margin-top"] || cStyle[0];
            css["margin-right"] = css["margin-right"] || cStyle[1];
            css["margin-bottom"] = css["margin-bottom"] || cStyle[2];
            css["margin-left"] = css["margin-left"] || cStyle[1];
            break;
          case 4:
            css["margin-top"] = css["margin-top"] || cStyle[0];
            css["margin-right"] = css["margin-right"] || cStyle[1];
            css["margin-bottom"] = css["margin-bottom"] || cStyle[2];
            css["margin-left"] = css["margin-left"] || cStyle[3];
        }
        delete css.margin;
      }
      return css;
    }
    /**
     * @return {undefined}
     */
    function updateStyle() {
      /**
       * @param {string} value
       * @return {?}
       */
      function addPixelSuffix(value) {
        return value.length > 0 && (/^[0-9]+$/.test(value) && (value += "px")), value;
      }
      if (editor.settings.image_advtab) {
        var data = element.toJSON();
        var css = dom.parseStyle(data.style);
        css = removeComments(css);
        if (data.vspace) {
          css["margin-top"] = css["margin-bottom"] = addPixelSuffix(data.vspace);
        }
        if (data.hspace) {
          css["margin-left"] = css["margin-right"] = addPixelSuffix(data.hspace);
        }
        if (data.border) {
          css["border-width"] = addPixelSuffix(data.border);
        }
        element.find("#style").value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
      }
    }
    /**
     * @return {undefined}
     */
    function showDialog() {
      if (editor.settings.image_advtab) {
        var data = element.toJSON();
        var css = dom.parseStyle(data.style);
        element.find("#vspace").value("");
        element.find("#hspace").value("");
        css = removeComments(css);
        if (css["margin-top"] && css["margin-bottom"] || css["margin-right"] && css["margin-left"]) {
          if (css["margin-top"] === css["margin-bottom"]) {
            element.find("#vspace").value(removePixelSuffix(css["margin-top"]));
          } else {
            element.find("#vspace").value("");
          }
          if (css["margin-right"] === css["margin-left"]) {
            element.find("#hspace").value(removePixelSuffix(css["margin-right"]));
          } else {
            element.find("#hspace").value("");
          }
        }
        if (css["border-width"]) {
          element.find("#border").value(removePixelSuffix(css["border-width"]));
        }
        element.find("#style").value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
      }
    }
    var element;
    var imgElm;
    var rootElement;
    var height;
    var width;
    var imageListCtrl;
    var item;
    var data = {};
    var dom = editor.dom;
    /** @type {boolean} */
    var u = editor.settings.image_dimensions !== false;
    imgElm = editor.selection.getNode();
    rootElement = dom.getParent(imgElm, "figure.image");
    if (rootElement) {
      imgElm = dom.select("img", rootElement)[0];
    }
    if (imgElm) {
      if ("IMG" != imgElm.nodeName || (imgElm.getAttribute("data-mce-object") || imgElm.getAttribute("data-mce-placeholder"))) {
        /** @type {null} */
        imgElm = null;
      }
    }
    if (imgElm) {
      height = dom.getAttrib(imgElm, "width");
      width = dom.getAttrib(imgElm, "height");
      data = {
        src : dom.getAttrib(imgElm, "src"),
        alt : dom.getAttrib(imgElm, "alt"),
        title : dom.getAttrib(imgElm, "title"),
        "class" : dom.getAttrib(imgElm, "class"),
        width : height,
        height : width,
        caption : !!rootElement
      };
    }
    if (content) {
      imageListCtrl = {
        type : "listbox",
        label : "Image list",
        values : compile(content, function(opt) {
          opt.value = editor.convertURL(opt.value || opt.url, "src");
        }, [{
          text : "None",
          value : ""
        }]),
        value : data.src && editor.convertURL(data.src, "src"),
        /**
         * @param {HTMLLabelElement} e
         * @return {undefined}
         */
        onselect : function(e) {
          var altCtrl = element.find("#alt");
          if (!altCtrl.value() || e.lastControl && altCtrl.value() == e.lastControl.text()) {
            altCtrl.value(e.control.text());
          }
          element.find("#src").value(e.control.value()).fire("change");
        },
        /**
         * @return {undefined}
         */
        onPostRender : function() {
          imageListCtrl = this;
        }
      };
    }
    if (editor.settings.image_class_list) {
      item = {
        name : "class",
        type : "listbox",
        label : "Class",
        values : compile(editor.settings.image_class_list, function(opt) {
          if (opt.value) {
            /**
             * @return {?}
             */
            opt.textStyle = function() {
              return editor.formatter.getCssText({
                inline : "img",
                classes : [opt.value]
              });
            };
          }
        })
      };
    }
    /** @type {Array} */
    var items = [{
      name : "src",
      type : "filepicker",
      filetype : "image",
      label : "Source",
      autofocus : true,
      /** @type {function (Object): undefined} */
      onchange : init
    }, imageListCtrl];
    if (editor.settings.image_description !== false) {
      items.push({
        name : "alt",
        type : "textbox",
        label : "Image description"
      });
    }
    if (editor.settings.image_title) {
      items.push({
        name : "title",
        type : "textbox",
        label : "Image Title"
      });
    }
    if (u) {
      items.push({
        type : "container",
        label : "Dimensions",
        layout : "flex",
        direction : "row",
        align : "center",
        spacing : 5,
        items : [{
          name : "width",
          type : "textbox",
          maxLength : 5,
          size : 3,
          /** @type {function (): undefined} */
          onchange : recalcSize,
          ariaLabel : "Width"
        }, {
          type : "label",
          text : "x"
        }, {
          name : "height",
          type : "textbox",
          maxLength : 5,
          size : 3,
          /** @type {function (): undefined} */
          onchange : recalcSize,
          ariaLabel : "Height"
        }, {
          name : "constrain",
          type : "checkbox",
          checked : true,
          text : "Constrain proportions"
        }]
      });
    }
    items.push(item);
    if (editor.settings.image_caption) {
      if (tinymce.Env.ceFalse) {
        items.push({
          name : "caption",
          type : "checkbox",
          label : "Caption"
        });
      }
    }
    if (editor.settings.image_advtab) {
      if (imgElm) {
        if (imgElm.style.marginLeft) {
          if (imgElm.style.marginRight) {
            if (imgElm.style.marginLeft === imgElm.style.marginRight) {
              data.hspace = removePixelSuffix(imgElm.style.marginLeft);
            }
          }
        }
        if (imgElm.style.marginTop) {
          if (imgElm.style.marginBottom) {
            if (imgElm.style.marginTop === imgElm.style.marginBottom) {
              data.vspace = removePixelSuffix(imgElm.style.marginTop);
            }
          }
        }
        if (imgElm.style.borderWidth) {
          data.border = removePixelSuffix(imgElm.style.borderWidth);
        }
        data.style = editor.dom.serializeStyle(editor.dom.parseStyle(editor.dom.getAttrib(imgElm, "style")));
      }
      element = editor.windowManager.open({
        title : "Insert/edit image",
        data : data,
        bodyType : "tabpanel",
        body : [{
          title : "General",
          type : "form",
          items : items
        }, {
          title : "Advanced",
          type : "form",
          pack : "start",
          items : [{
            label : "Style",
            name : "style",
            type : "textbox",
            /** @type {function (): undefined} */
            onchange : showDialog
          }, {
            type : "form",
            layout : "grid",
            packV : "start",
            columns : 2,
            padding : 0,
            alignH : ["left", "right"],
            defaults : {
              type : "textbox",
              maxWidth : 50,
              /** @type {function (): undefined} */
              onchange : updateStyle
            },
            items : [{
              label : "Vertical space",
              name : "vspace"
            }, {
              label : "Horizontal space",
              name : "hspace"
            }, {
              label : "Border",
              name : "border"
            }]
          }]
        }],
        /** @type {function (): undefined} */
        onSubmit : onSubmitForm
      });
    } else {
      element = editor.windowManager.open({
        title : "Insert/edit image",
        data : data,
        body : items,
        /** @type {function (): undefined} */
        onSubmit : onSubmitForm
      });
    }
  }
  editor.on("preInit", function() {
    /**
     * @param {HTMLElement} block
     * @return {?}
     */
    function run(block) {
      var cls = block.attr("class");
      return cls && /\bimage\b/.test(cls);
    }
    /**
     * @param {boolean} value
     * @return {?}
     */
    function onSuccess(value) {
      return function(nodes) {
        /**
         * @param {HTMLElement} node
         * @return {undefined}
         */
        function callback(node) {
          node.attr("contenteditable", value ? "true" : null);
        }
        var node;
        var i = nodes.length;
        for (;i--;) {
          node = nodes[i];
          if (run(node)) {
            node.attr("contenteditable", value ? "false" : null);
            tinymce.each(node.getAll("figcaption"), callback);
          }
        }
      };
    }
    editor.parser.addNodeFilter("figure", onSuccess(true));
    editor.serializer.addNodeFilter("figure", onSuccess(false));
  });
  editor.addButton("image", {
    icon : "image",
    tooltip : "Insert/edit image",
    onclick : createImageList(showDialog),
    stateSelector : "img:not([data-mce-object],[data-mce-placeholder]),figure.image"
  });
  editor.addMenuItem("image", {
    icon : "image",
    text : "Insert/edit image",
    onclick : createImageList(showDialog),
    context : "insert",
    prependToContext : true
  });
  editor.addCommand("mceImage", createImageList(showDialog));
});
