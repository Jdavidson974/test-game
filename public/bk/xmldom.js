'use strict'; self["xmlDomLib"] = {};
(function () {
    var exports = self["xmlDomLib"]; function copy(src, dest) { for (var p in src) dest[p] = src[p] } function _extends(Class, Super) { var pt = Class.prototype; if (!(pt instanceof Super)) { function t() { } t.prototype = Super.prototype; t = new t; copy(pt, t); Class.prototype = pt = t } if (pt.constructor != Class) { if (typeof Class != "function") console.error("unknow Class:" + Class); pt.constructor = Class } } var htmlns = "http://www.w3.org/1999/xhtml"; var NodeType = {}; var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1; var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE =
        2; var TEXT_NODE = NodeType.TEXT_NODE = 3; var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4; var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5; var ENTITY_NODE = NodeType.ENTITY_NODE = 6; var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7; var COMMENT_NODE = NodeType.COMMENT_NODE = 8; var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9; var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10; var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11; var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
    var ExceptionCode = {}; var ExceptionMessage = {}; var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1); var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2); var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3); var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4); var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR =
        (ExceptionMessage[5] = "Invalid character", 5); var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6); var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7); var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8); var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9); var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR =
            (ExceptionMessage[10] = "Attribute in use", 10); var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11); var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12); var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13); var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14); var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] =
                "Invalid access", 15); function DOMException(code, message) { if (message instanceof Error) var error = message; else { error = this; Error.call(this, ExceptionMessage[code]); this.message = ExceptionMessage[code]; if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException) } error.code = code; if (message) this.message = this.message + ": " + message; return error } DOMException.prototype = Error.prototype; copy(ExceptionCode, DOMException); function NodeList() { } NodeList.prototype = {
                    length: 0, item: function (index) {
                        return this[index] ||
                            null
                    }, toString: function (isHTML, nodeFilter) { for (var buf = [], i = 0; i < this.length; i++)serializeToString(this[i], buf, isHTML, nodeFilter); return buf.join("") }
                }; function LiveNodeList(node, refresh) { this._node = node; this._refresh = refresh; _updateLiveList(this) } function _updateLiveList(list) { var inc = list._node._inc || list._node.ownerDocument._inc; if (list._inc != inc) { var ls = list._refresh(list._node); __set__(list, "length", ls.length); copy(ls, list); list._inc = inc } } LiveNodeList.prototype.item = function (i) {
                    _updateLiveList(this);
                    return this[i]
                }; _extends(LiveNodeList, NodeList); function NamedNodeMap() { } function _findNodeIndex(list, node) { var i = list.length; while (i--) if (list[i] === node) return i } function _addNamedNode(el, list, newAttr, oldAttr) { if (oldAttr) list[_findNodeIndex(list, oldAttr)] = newAttr; else list[list.length++] = newAttr; if (el) { newAttr.ownerElement = el; var doc = el.ownerDocument; if (doc) { oldAttr && _onRemoveAttribute(doc, el, oldAttr); _onAddAttribute(doc, el, newAttr) } } } function _removeNamedNode(el, list, attr) {
                    var i = _findNodeIndex(list,
                        attr); if (i >= 0) { var lastIndex = list.length - 1; while (i < lastIndex) list[i] = list[++i]; list.length = lastIndex; if (el) { var doc = el.ownerDocument; if (doc) { _onRemoveAttribute(doc, el, attr); attr.ownerElement = null } } } else throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + "@" + attr));
                } NamedNodeMap.prototype = {
                    length: 0, item: NodeList.prototype.item, getNamedItem: function (key) { var i = this.length; while (i--) { var attr = this[i]; if (attr.nodeName == key) return attr } }, setNamedItem: function (attr) {
                        var el = attr.ownerElement; if (el && el !=
                            this._ownerElement) throw new DOMException(INUSE_ATTRIBUTE_ERR); var oldAttr = this.getNamedItem(attr.nodeName); _addNamedNode(this._ownerElement, this, attr, oldAttr); return oldAttr
                    }, setNamedItemNS: function (attr) { var el = attr.ownerElement, oldAttr; if (el && el != this._ownerElement) throw new DOMException(INUSE_ATTRIBUTE_ERR); oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName); _addNamedNode(this._ownerElement, this, attr, oldAttr); return oldAttr }, removeNamedItem: function (key) {
                        var attr = this.getNamedItem(key);
                        _removeNamedNode(this._ownerElement, this, attr); return attr
                    }, removeNamedItemNS: function (namespaceURI, localName) { var attr = this.getNamedItemNS(namespaceURI, localName); _removeNamedNode(this._ownerElement, this, attr); return attr }, getNamedItemNS: function (namespaceURI, localName) { var i = this.length; while (i--) { var node = this[i]; if (node.localName == localName && node.namespaceURI == namespaceURI) return node } return null }
                }; function DOMImplementation(features) {
                    this._features = {}; if (features) for (var feature in features) this._features =
                        features[feature]
                } DOMImplementation.prototype = {
                    hasFeature: function (feature, version) { var versions = this._features[feature.toLowerCase()]; if (versions && (!version || version in versions)) return true; else return false }, createDocument: function (namespaceURI, qualifiedName, doctype) { var doc = new Document; doc.implementation = this; doc.childNodes = new NodeList; doc.doctype = doctype; if (doctype) doc.appendChild(doctype); if (qualifiedName) { var root = doc.createElementNS(namespaceURI, qualifiedName); doc.appendChild(root) } return doc },
                    createDocumentType: function (qualifiedName, publicId, systemId) { var node = new DocumentType; node.name = qualifiedName; node.nodeName = qualifiedName; node.publicId = publicId; node.systemId = systemId; return node }
                }; function Node() { } Node.prototype = {
                    firstChild: null, lastChild: null, previousSibling: null, nextSibling: null, attributes: null, parentNode: null, childNodes: null, ownerDocument: null, nodeValue: null, namespaceURI: null, prefix: null, localName: null, insertBefore: function (newChild, refChild) {
                        return _insertBefore(this, newChild,
                            refChild)
                    }, replaceChild: function (newChild, oldChild) { this.insertBefore(newChild, oldChild); if (oldChild) this.removeChild(oldChild) }, removeChild: function (oldChild) { return _removeChild(this, oldChild) }, appendChild: function (newChild) { return this.insertBefore(newChild, null) }, hasChildNodes: function () { return this.firstChild != null }, cloneNode: function (deep) { return cloneNode(this.ownerDocument || this, this, deep) }, normalize: function () {
                        var child = this.firstChild; while (child) {
                            var next = child.nextSibling; if (next && next.nodeType ==
                                TEXT_NODE && child.nodeType == TEXT_NODE) { this.removeChild(next); child.appendData(next.data) } else { child.normalize(); child = next }
                        }
                    }, isSupported: function (feature, version) { return this.ownerDocument.implementation.hasFeature(feature, version) }, hasAttributes: function () { return this.attributes.length > 0 }, lookupPrefix: function (namespaceURI) { var el = this; while (el) { var map = el._nsMap; if (map) for (var n in map) if (map[n] == namespaceURI) return n; el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode } return null }, lookupNamespaceURI: function (prefix) {
                        var el =
                            this; while (el) { var map = el._nsMap; if (map) if (prefix in map) return map[prefix]; el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode } return null
                    }, isDefaultNamespace: function (namespaceURI) { var prefix = this.lookupPrefix(namespaceURI); return prefix == null }
                }; function _xmlEncoder(c) { return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";" } copy(NodeType, Node); copy(NodeType, Node.prototype); function _visitNode(node, callback) {
                    if (callback(node)) return true; if (node =
                        node.firstChild) { do if (_visitNode(node, callback)) return true; while (node = node.nextSibling) }
                } function Document() { } function _onAddAttribute(doc, el, newAttr) { doc && doc._inc++; var ns = newAttr.namespaceURI; if (ns == "http://www.w3.org/2000/xmlns/") el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value } function _onRemoveAttribute(doc, el, newAttr, remove) { doc && doc._inc++; var ns = newAttr.namespaceURI; if (ns == "http://www.w3.org/2000/xmlns/") delete el._nsMap[newAttr.prefix ? newAttr.localName : ""] } function _onUpdateChild(doc,
                    el, newChild) { if (doc && doc._inc) { doc._inc++; var cs = el.childNodes; if (newChild) cs[cs.length++] = newChild; else { var child = el.firstChild; var i = 0; while (child) { cs[i++] = child; child = child.nextSibling } cs.length = i } } } function _removeChild(parentNode, child) { var previous = child.previousSibling; var next = child.nextSibling; if (previous) previous.nextSibling = next; else parentNode.firstChild = next; if (next) next.previousSibling = previous; else parentNode.lastChild = previous; _onUpdateChild(parentNode.ownerDocument, parentNode); return child }
    function _insertBefore(parentNode, newChild, nextChild) {
        var cp = newChild.parentNode; if (cp) cp.removeChild(newChild); if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) { var newFirst = newChild.firstChild; if (newFirst == null) return newChild; var newLast = newChild.lastChild } else newFirst = newLast = newChild; var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild; newFirst.previousSibling = pre; newLast.nextSibling = nextChild; if (pre) pre.nextSibling = newFirst; else parentNode.firstChild = newFirst; if (nextChild == null) parentNode.lastChild =
            newLast; else nextChild.previousSibling = newLast; do newFirst.parentNode = parentNode; while (newFirst !== newLast && (newFirst = newFirst.nextSibling)); _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode); if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) newChild.firstChild = newChild.lastChild = null; return newChild
    } function _appendSingleChild(parentNode, newChild) {
        var cp = newChild.parentNode; if (cp) { var pre = parentNode.lastChild; cp.removeChild(newChild); var pre = parentNode.lastChild } var pre = parentNode.lastChild;
        newChild.parentNode = parentNode; newChild.previousSibling = pre; newChild.nextSibling = null; if (pre) pre.nextSibling = newChild; else parentNode.firstChild = newChild; parentNode.lastChild = newChild; _onUpdateChild(parentNode.ownerDocument, parentNode, newChild); return newChild
    } Document.prototype = {
        nodeName: "#document", nodeType: DOCUMENT_NODE, doctype: null, documentElement: null, _inc: 1, insertBefore: function (newChild, refChild) {
            if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
                var child = newChild.firstChild; while (child) {
                    var next =
                        child.nextSibling; this.insertBefore(child, refChild); child = next
                } return newChild
            } if (this.documentElement == null && newChild.nodeType == ELEMENT_NODE) this.documentElement = newChild; return _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild
        }, removeChild: function (oldChild) { if (this.documentElement == oldChild) this.documentElement = null; return _removeChild(this, oldChild) }, importNode: function (importedNode, deep) { return importNode(this, importedNode, deep) }, getElementById: function (id) {
            var rtv = null;
            _visitNode(this.documentElement, function (node) { if (node.nodeType == ELEMENT_NODE) if (node.getAttribute("id") == id) { rtv = node; return true } }); return rtv
        }, createElement: function (tagName) { var node = new Element; node.ownerDocument = this; node.nodeName = tagName; node.tagName = tagName; node.childNodes = new NodeList; var attrs = node.attributes = new NamedNodeMap; attrs._ownerElement = node; return node }, createDocumentFragment: function () { var node = new DocumentFragment; node.ownerDocument = this; node.childNodes = new NodeList; return node },
        createTextNode: function (data) { var node = new Text; node.ownerDocument = this; node.appendData(data); return node }, createComment: function (data) { var node = new Comment; node.ownerDocument = this; node.appendData(data); return node }, createCDATASection: function (data) { var node = new CDATASection; node.ownerDocument = this; node.appendData(data); return node }, createProcessingInstruction: function (target, data) {
            var node = new ProcessingInstruction; node.ownerDocument = this; node.tagName = node.target = target; node.nodeValue = node.data =
                data; return node
        }, createAttribute: function (name) { var node = new Attr; node.ownerDocument = this; node.name = name; node.nodeName = name; node.localName = name; node.specified = true; return node }, createEntityReference: function (name) { var node = new EntityReference; node.ownerDocument = this; node.nodeName = name; return node }, createElementNS: function (namespaceURI, qualifiedName) {
            var node = new Element; var pl = qualifiedName.split(":"); var attrs = node.attributes = new NamedNodeMap; node.childNodes = new NodeList; node.ownerDocument = this;
            node.nodeName = qualifiedName; node.tagName = qualifiedName; node.namespaceURI = namespaceURI; if (pl.length == 2) { node.prefix = pl[0]; node.localName = pl[1] } else node.localName = qualifiedName; attrs._ownerElement = node; return node
        }, createAttributeNS: function (namespaceURI, qualifiedName) {
            var node = new Attr; var pl = qualifiedName.split(":"); node.ownerDocument = this; node.nodeName = qualifiedName; node.name = qualifiedName; node.namespaceURI = namespaceURI; node.specified = true; if (pl.length == 2) { node.prefix = pl[0]; node.localName = pl[1] } else node.localName =
                qualifiedName; return node
        }
    }; _extends(Document, Node); function Element() { this._nsMap = {} } Element.prototype = {
        nodeType: ELEMENT_NODE, hasAttribute: function (name) { return this.getAttributeNode(name) != null }, getAttribute: function (name) { var attr = this.getAttributeNode(name); return attr && attr.value || "" }, getAttributeNode: function (name) { return this.attributes.getNamedItem(name) }, setAttribute: function (name, value) { var attr = this.ownerDocument.createAttribute(name); attr.value = attr.nodeValue = "" + value; this.setAttributeNode(attr) },
        removeAttribute: function (name) { var attr = this.getAttributeNode(name); attr && this.removeAttributeNode(attr) }, appendChild: function (newChild) { if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) return this.insertBefore(newChild, null); else return _appendSingleChild(this, newChild) }, setAttributeNode: function (newAttr) { return this.attributes.setNamedItem(newAttr) }, setAttributeNodeNS: function (newAttr) { return this.attributes.setNamedItemNS(newAttr) }, removeAttributeNode: function (oldAttr) { return this.attributes.removeNamedItem(oldAttr.nodeName) },
        removeAttributeNS: function (namespaceURI, localName) { var old = this.getAttributeNodeNS(namespaceURI, localName); old && this.removeAttributeNode(old) }, hasAttributeNS: function (namespaceURI, localName) { return this.getAttributeNodeNS(namespaceURI, localName) != null }, getAttributeNS: function (namespaceURI, localName) { var attr = this.getAttributeNodeNS(namespaceURI, localName); return attr && attr.value || "" }, setAttributeNS: function (namespaceURI, qualifiedName, value) {
            var attr = this.ownerDocument.createAttributeNS(namespaceURI,
                qualifiedName); attr.value = attr.nodeValue = "" + value; this.setAttributeNode(attr)
        }, getAttributeNodeNS: function (namespaceURI, localName) { return this.attributes.getNamedItemNS(namespaceURI, localName) }, getElementsByTagName: function (tagName) { return new LiveNodeList(this, function (base) { var ls = []; _visitNode(base, function (node) { if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === "*" || node.tagName == tagName)) ls.push(node) }); return ls }) }, getElementsByTagNameNS: function (namespaceURI, localName) {
            return new LiveNodeList(this,
                function (base) { var ls = []; _visitNode(base, function (node) { if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) ls.push(node) }); return ls })
        }
    }; Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName; Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS; _extends(Element, Node); function Attr() { } Attr.prototype.nodeType = ATTRIBUTE_NODE; _extends(Attr, Node); function CharacterData() { }
    CharacterData.prototype = {
        data: "", substringData: function (offset, count) { return this.data.substring(offset, offset + count) }, appendData: function (text) { text = this.data + text; this.nodeValue = this.data = text; this.length = text.length }, insertData: function (offset, text) { this.replaceData(offset, 0, text) }, appendChild: function (newChild) { throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]); }, deleteData: function (offset, count) { this.replaceData(offset, count, "") }, replaceData: function (offset, count, text) {
            var start = this.data.substring(0,
                offset); var end = this.data.substring(offset + count); text = start + text + end; this.nodeValue = this.data = text; this.length = text.length
        }
    }; _extends(CharacterData, Node); function Text() { } Text.prototype = {
        nodeName: "#text", nodeType: TEXT_NODE, splitText: function (offset) {
            var text = this.data; var newText = text.substring(offset); text = text.substring(0, offset); this.data = this.nodeValue = text; this.length = text.length; var newNode = this.ownerDocument.createTextNode(newText); if (this.parentNode) this.parentNode.insertBefore(newNode, this.nextSibling);
            return newNode
        }
    }; _extends(Text, CharacterData); function Comment() { } Comment.prototype = { nodeName: "#comment", nodeType: COMMENT_NODE }; _extends(Comment, CharacterData); function CDATASection() { } CDATASection.prototype = { nodeName: "#cdata-section", nodeType: CDATA_SECTION_NODE }; _extends(CDATASection, CharacterData); function DocumentType() { } DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE; _extends(DocumentType, Node); function Notation() { } Notation.prototype.nodeType = NOTATION_NODE; _extends(Notation, Node); function Entity() { }
    Entity.prototype.nodeType = ENTITY_NODE; _extends(Entity, Node); function EntityReference() { } EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE; _extends(EntityReference, Node); function DocumentFragment() { } DocumentFragment.prototype.nodeName = "#document-fragment"; DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE; _extends(DocumentFragment, Node); function ProcessingInstruction() { } ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE; _extends(ProcessingInstruction, Node); function XMLSerializer() { }
    XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) { return nodeSerializeToString.call(node, isHtml, nodeFilter) }; Node.prototype.toString = nodeSerializeToString; function nodeSerializeToString(isHtml, nodeFilter) {
        var buf = []; var refNode = this.nodeType == 9 && this.documentElement || this; var prefix = refNode.prefix; var uri = refNode.namespaceURI; if (uri && prefix == null) { var prefix = refNode.lookupPrefix(uri); if (prefix == null) var visibleNamespaces = [{ namespace: uri, prefix: null }] } serializeToString(this,
            buf, isHtml, nodeFilter, visibleNamespaces); return buf.join("")
    } function needNamespaceDefine(node, isHTML, visibleNamespaces) { var prefix = node.prefix || ""; var uri = node.namespaceURI; if (!prefix && !uri) return false; if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" || uri == "http://www.w3.org/2000/xmlns/") return false; var i = visibleNamespaces.length; while (i--) { var ns = visibleNamespaces[i]; if (ns.prefix == prefix) return ns.namespace != uri } return true } function serializeToString(node, buf, isHTML, nodeFilter,
        visibleNamespaces) {
        if (nodeFilter) { node = nodeFilter(node); if (node) { if (typeof node == "string") { buf.push(node); return } } else return } switch (node.nodeType) {
            case ELEMENT_NODE: if (!visibleNamespaces) visibleNamespaces = []; var startVisibleNamespaces = visibleNamespaces.length; var attrs = node.attributes; var len = attrs.length; var child = node.firstChild; var nodeName = node.tagName; isHTML = htmlns === node.namespaceURI || isHTML; buf.push("<", nodeName); for (var i = 0; i < len; i++) {
                var attr = attrs.item(i); if (attr.prefix == "xmlns") visibleNamespaces.push({
                    prefix: attr.localName,
                    namespace: attr.value
                }); else if (attr.nodeName == "xmlns") visibleNamespaces.push({ prefix: "", namespace: attr.value })
            } for (var i = 0; i < len; i++) { var attr = attrs.item(i); if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) { var prefix = attr.prefix || ""; var uri = attr.namespaceURI; var ns = prefix ? " xmlns:" + prefix : " xmlns"; buf.push(ns, '="', uri, '"'); visibleNamespaces.push({ prefix: prefix, namespace: uri }) } serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces) } if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
                var prefix =
                    node.prefix || ""; var uri = node.namespaceURI; var ns = prefix ? " xmlns:" + prefix : " xmlns"; buf.push(ns, '="', uri, '"'); visibleNamespaces.push({ prefix: prefix, namespace: uri })
            } if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
                buf.push(">"); if (isHTML && /^script$/i.test(nodeName)) while (child) { if (child.data) buf.push(child.data); else serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces); child = child.nextSibling } else while (child) {
                    serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
                    child = child.nextSibling
                } buf.push("</", nodeName, ">")
            } else buf.push("/>"); return; case DOCUMENT_NODE: case DOCUMENT_FRAGMENT_NODE: var child = node.firstChild; while (child) { serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces); child = child.nextSibling } return; case ATTRIBUTE_NODE: return buf.push(" ", node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"'); case TEXT_NODE: return buf.push(node.data.replace(/[<&]/g, _xmlEncoder)); case CDATA_SECTION_NODE: return buf.push("<![CDATA[", node.data, "]]\x3e");
            case COMMENT_NODE: return buf.push("\x3c!--", node.data, "--\x3e"); case DOCUMENT_TYPE_NODE: var pubid = node.publicId; var sysid = node.systemId; buf.push("<!DOCTYPE ", node.name); if (pubid) { buf.push(' PUBLIC "', pubid); if (sysid && sysid != ".") buf.push('" "', sysid); buf.push('">') } else if (sysid && sysid != ".") buf.push(' SYSTEM "', sysid, '">'); else { var sub = node.internalSubset; if (sub) buf.push(" [", sub, "]"); buf.push(">") } return; case PROCESSING_INSTRUCTION_NODE: return buf.push("<?", node.target, " ", node.data, "?>"); case ENTITY_REFERENCE_NODE: return buf.push("&",
                node.nodeName, ";"); default: buf.push("??", node.nodeName)
        }
    } function importNode(doc, node, deep) { var node2; switch (node.nodeType) { case ELEMENT_NODE: node2 = node.cloneNode(false); node2.ownerDocument = doc; case DOCUMENT_FRAGMENT_NODE: break; case ATTRIBUTE_NODE: deep = true; break }if (!node2) node2 = node.cloneNode(false); node2.ownerDocument = doc; node2.parentNode = null; if (deep) { var child = node.firstChild; while (child) { node2.appendChild(importNode(doc, child, deep)); child = child.nextSibling } } return node2 } function cloneNode(doc,
        node, deep) {
        var node2 = new node.constructor; for (var n in node) { var v = node[n]; if (typeof v != "object") if (v != node2[n]) node2[n] = v } if (node.childNodes) node2.childNodes = new NodeList; node2.ownerDocument = doc; switch (node2.nodeType) { case ELEMENT_NODE: var attrs = node.attributes; var attrs2 = node2.attributes = new NamedNodeMap; var len = attrs.length; attrs2._ownerElement = node2; for (var i = 0; i < len; i++)node2.setAttributeNode(cloneNode(doc, attrs.item(i), true)); break; case ATTRIBUTE_NODE: deep = true }if (deep) {
            var child = node.firstChild;
            while (child) { node2.appendChild(cloneNode(doc, child, deep)); child = child.nextSibling }
        } return node2
    } function __set__(object, key, value) { object[key] = value } try {
        if (Object.defineProperty) {
            Object.defineProperty(LiveNodeList.prototype, "length", { get: function () { _updateLiveList(this); return this.$$length } }); Object.defineProperty(Node.prototype, "textContent", {
                get: function () { return getTextContent(this) }, set: function (data) {
                    switch (this.nodeType) {
                        case ELEMENT_NODE: case DOCUMENT_FRAGMENT_NODE: while (this.firstChild) this.removeChild(this.firstChild);
                            if (data || String(data)) this.appendChild(this.ownerDocument.createTextNode(data)); break; default: this.data = data; this.value = data; this.nodeValue = data
                    }
                }
            }); function getTextContent(node) { switch (node.nodeType) { case ELEMENT_NODE: case DOCUMENT_FRAGMENT_NODE: var buf = []; node = node.firstChild; while (node) { if (node.nodeType !== 7 && node.nodeType !== 8) buf.push(getTextContent(node)); node = node.nextSibling } return buf.join(""); default: return node.nodeValue } } __set__ = function (object, key, value) { object["$$" + key] = value }
        }
    } catch (e) { } exports.DOMImplementation =
        DOMImplementation; exports.XMLSerializer = XMLSerializer
})();
(function () {
    var exports = self["xmlDomLib"]; var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/; var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]"); var tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$"); var S_TAG = 0; var S_ATTR = 1; var S_ATTR_SPACE = 2; var S_EQ = 3; var S_ATTR_NOQUOT_VALUE =
        4; var S_ATTR_END = 5; var S_TAG_SPACE = 6; var S_TAG_CLOSE = 7; function XMLReader() { } XMLReader.prototype = { parse: function (source, defaultNSMap, entityMap) { var domBuilder = this.domBuilder; domBuilder.startDocument(); _copy(defaultNSMap, defaultNSMap = {}); parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler); domBuilder.endDocument() } }; function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
            function fixedFromCharCode(code) {
                if (code > 65535) {
                    code -= 65536; var surrogate1 = 55296 + (code >> 10), surrogate2 =
                        56320 + (code & 1023); return String.fromCharCode(surrogate1, surrogate2)
                } else return String.fromCharCode(code)
            } function entityReplacer(a) { var k = a.slice(1, -1); if (k in entityMap) return entityMap[k]; else if (k.charAt(0) === "#") return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x"))); else { errorHandler.error("entity not found:" + a); return a } } function appendText(end) {
                if (end > start) {
                    var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer); locator && position(start); domBuilder.characters(xt, 0,
                        end - start); start = end
                }
            } function position(p, m) { while (p >= lineEnd && (m = linePattern.exec(source))) { lineStart = m.index; lineEnd = lineStart + m[0].length; locator.lineNumber++ } locator.columnNumber = p - lineStart + 1 } var lineStart = 0; var lineEnd = 0; var linePattern = /.*(?:\r\n?|\n)|.*$/g; var locator = domBuilder.locator; var parseStack = [{ currentNSMap: defaultNSMapCopy }]; var closeMap = {}; var start = 0; while (true) {
                try {
                    var tagStart = source.indexOf("<", start); if (tagStart < 0) {
                        if (!source.substr(start).match(/^\s*$/)) {
                            var doc = domBuilder.doc;
                            var text = doc.createTextNode(source.substr(start)); doc.appendChild(text); domBuilder.currentElement = text
                        } return
                    } if (tagStart > start) appendText(tagStart); switch (source.charAt(tagStart + 1)) {
                        case "/": var end = source.indexOf(">", tagStart + 3); var tagName = source.substring(tagStart + 2, end); var config = parseStack.pop(); if (end < 0) { tagName = source.substring(tagStart + 2).replace(/[\s<].*/, ""); errorHandler.error("end tag name: " + tagName + " is not complete:" + config.tagName); end = tagStart + 1 + tagName.length } else if (tagName.match(/\s</)) {
                            tagName =
                                tagName.replace(/[\s<].*/, ""); errorHandler.error("end tag name: " + tagName + " maybe not complete"); end = tagStart + 1 + tagName.length
                        } var localNSMap = config.localNSMap; var endMatch = config.tagName == tagName; var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase(); if (endIgnoreCaseMach) {
                            domBuilder.endElement(config.uri, config.localName, tagName); if (localNSMap) for (var prefix in localNSMap) domBuilder.endPrefixMapping(prefix); if (!endMatch) errorHandler.fatalError("end tag name: " +
                                tagName + " is not match the current start tagName:" + config.tagName)
                        } else parseStack.push(config); end++; break; case "?": locator && position(tagStart); end = parseInstruction(source, tagStart, domBuilder); break; case "!": locator && position(tagStart); end = parseDCC(source, tagStart, domBuilder, errorHandler); break; default: locator && position(tagStart); var el = new ElementAttributes; var currentNSMap = parseStack[parseStack.length - 1].currentNSMap; var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer,
                            errorHandler); var len = el.length; if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) { el.closed = true; if (!entityMap.nbsp) errorHandler.warning("unclosed xml attribute") } if (locator && len) { var locator2 = copyLocator(locator, {}); for (var i = 0; i < len; i++) { var a = el[i]; position(a.offset); a.locator = copyLocator(locator, {}) } domBuilder.locator = locator2; if (appendElement(el, domBuilder, currentNSMap)) parseStack.push(el); domBuilder.locator = locator } else if (appendElement(el, domBuilder, currentNSMap)) parseStack.push(el);
                            if (el.uri === "http://www.w3.org/1999/xhtml" && !el.closed) end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder); else end++
                    }
                } catch (e) { errorHandler.error("element parse error: " + e); end = -1 } if (end > start) start = end; else appendText(Math.max(tagStart, start) + 1)
            }
        } function copyLocator(f, t) { t.lineNumber = f.lineNumber; t.columnNumber = f.columnNumber; return t } function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
            var attrName; var value; var p = ++start; var s = S_TAG;
            while (true) {
                var c = source.charAt(p); switch (c) {
                    case "=": if (s === S_ATTR) { attrName = source.slice(start, p); s = S_EQ } else if (s === S_ATTR_SPACE) s = S_EQ; else throw new Error("attribute equal must after attrName"); break; case "'": case '"': if (s === S_EQ || s === S_ATTR) {
                        if (s === S_ATTR) { errorHandler.warning('attribute value must after "="'); attrName = source.slice(start, p) } start = p + 1; p = source.indexOf(c, start); if (p > 0) { value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer); el.add(attrName, value, start - 1); s = S_ATTR_END } else throw new Error("attribute value no end '" +
                            c + "' match");
                    } else if (s == S_ATTR_NOQUOT_VALUE) { value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer); el.add(attrName, value, start); errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!"); start = p + 1; s = S_ATTR_END } else throw new Error('attribute value must after "="'); break; case "/": switch (s) {
                        case S_TAG: el.setTagName(source.slice(start, p)); case S_ATTR_END: case S_TAG_SPACE: case S_TAG_CLOSE: s = S_TAG_CLOSE; el.closed = true; case S_ATTR_NOQUOT_VALUE: case S_ATTR: case S_ATTR_SPACE: break;
                        default: throw new Error("attribute invalid close char('/')");
                    }break; case "": errorHandler.error("unexpected end of input"); if (s == S_TAG) el.setTagName(source.slice(start, p)); return p; case ">": switch (s) {
                        case S_TAG: el.setTagName(source.slice(start, p)); case S_ATTR_END: case S_TAG_SPACE: case S_TAG_CLOSE: break; case S_ATTR_NOQUOT_VALUE: case S_ATTR: value = source.slice(start, p); if (value.slice(-1) === "/") { el.closed = true; value = value.slice(0, -1) } case S_ATTR_SPACE: if (s === S_ATTR_SPACE) value = attrName; if (s == S_ATTR_NOQUOT_VALUE) {
                            errorHandler.warning('attribute "' +
                                value + '" missed quot(")!!'); el.add(attrName, value.replace(/&#?\w+;/g, entityReplacer), start)
                        } else { if (currentNSMap[""] !== "http://www.w3.org/1999/xhtml" || !value.match(/^(?:disabled|checked|selected)$/i)) errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!'); el.add(value, value, start) } break; case S_EQ: throw new Error("attribute value missed!!");
                    }return p; case "\u0080": c = " "; default: if (c <= " ") switch (s) {
                        case S_TAG: el.setTagName(source.slice(start, p)); s = S_TAG_SPACE; break; case S_ATTR: attrName =
                            source.slice(start, p); s = S_ATTR_SPACE; break; case S_ATTR_NOQUOT_VALUE: var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer); errorHandler.warning('attribute "' + value + '" missed quot(")!!'); el.add(attrName, value, start); case S_ATTR_END: s = S_TAG_SPACE; break
                    } else switch (s) {
                        case S_ATTR_SPACE: var tagName = el.tagName; if (currentNSMap[""] !== "http://www.w3.org/1999/xhtml" || !attrName.match(/^(?:disabled|checked|selected)$/i)) errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                            el.add(attrName, attrName, start); start = p; s = S_ATTR; break; case S_ATTR_END: errorHandler.warning('attribute space is required"' + attrName + '"!!'); case S_TAG_SPACE: s = S_ATTR; start = p; break; case S_EQ: s = S_ATTR_NOQUOT_VALUE; start = p; break; case S_TAG_CLOSE: throw new Error("elements closed character '/' and '>' must be connected to");
                    }
                }p++
            }
        } function appendElement(el, domBuilder, currentNSMap) {
            var tagName = el.tagName; var localNSMap = null; var i = el.length; while (i--) {
                var a = el[i]; var qName = a.qName; var value = a.value; var nsp =
                    qName.indexOf(":"); if (nsp > 0) { var prefix = a.prefix = qName.slice(0, nsp); var localName = qName.slice(nsp + 1); var nsPrefix = prefix === "xmlns" && localName } else { localName = qName; prefix = null; if (qName === "xmlns") nsPrefix = ""; else nsPrefix = "__special_false_value__" } a.localName = localName; if (nsPrefix !== "__special_false_value__") {
                        if (localNSMap == null) { localNSMap = {}; _copy(currentNSMap, currentNSMap = {}) } currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value; a.uri = "http://www.w3.org/2000/xmlns/"; domBuilder.startPrefixMapping(nsPrefix,
                            value)
                    }
            } var i = el.length; while (i--) { a = el[i]; var prefix = a.prefix; if (prefix) { if (prefix === "xml") a.uri = "http://www.w3.org/XML/1998/namespace"; if (prefix !== "xmlns") a.uri = currentNSMap[prefix || ""] } } var nsp = tagName.indexOf(":"); if (nsp > 0) { prefix = el.prefix = tagName.slice(0, nsp); localName = el.localName = tagName.slice(nsp + 1) } else { prefix = null; localName = el.localName = tagName } var ns = el.uri = currentNSMap[prefix || ""]; domBuilder.startElement(ns, localName, tagName, el); if (el.closed) {
                domBuilder.endElement(ns, localName, tagName);
                if (localNSMap) for (prefix in localNSMap) domBuilder.endPrefixMapping(prefix)
            } else { el.currentNSMap = currentNSMap; el.localNSMap = localNSMap; return true }
        } function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
            if (/^(?:script|textarea)$/i.test(tagName)) {
                var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd); var text = source.substring(elStartEnd + 1, elEndStart); if (/[&<]/.test(text)) {
                    if (/^script$/i.test(tagName)) { domBuilder.characters(text, 0, text.length); return elEndStart } text =
                        text.replace(/&#?\w+;/g, entityReplacer); domBuilder.characters(text, 0, text.length); return elEndStart
                }
            } return elStartEnd + 1
        } function fixSelfClosed(source, elStartEnd, tagName, closeMap) { var pos = closeMap[tagName]; if (pos == null) { pos = source.lastIndexOf("</" + tagName + ">"); if (pos < elStartEnd) pos = source.lastIndexOf("</" + tagName); closeMap[tagName] = pos } return pos < elStartEnd } function _copy(source, target) { for (var n in source) target[n] = source[n] } function parseDCC(source, start, domBuilder, errorHandler) {
            var next = source.charAt(start +
                2); switch (next) {
                    case "-": if (source.charAt(start + 3) === "-") { var end = source.indexOf("--\x3e", start + 4); if (end > start) { domBuilder.comment(source, start + 4, end - start - 4); return end + 3 } else { errorHandler.error("Unclosed comment"); return -1 } } else return -1; default: if (source.substr(start + 3, 6) == "CDATA[") { var end = source.indexOf("]]\x3e", start + 9); domBuilder.startCDATA(); domBuilder.characters(source, start + 9, end - start - 9); domBuilder.endCDATA(); return end + 3 } var matchs = split(source, start); var len = matchs.length; if (len > 1 &&
                        /!doctype/i.test(matchs[0][0])) { var name = matchs[1][0]; var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]; var sysid = len > 4 && matchs[4][0]; var lastMatch = matchs[len - 1]; domBuilder.startDTD(name, pubid && pubid.replace(/^(['"])(.*?)\1$/, "$2"), sysid && sysid.replace(/^(['"])(.*?)\1$/, "$2")); domBuilder.endDTD(); return lastMatch.index + lastMatch[0].length }
                }return -1
        } function parseInstruction(source, start, domBuilder) {
            var end = source.indexOf("?>", start); if (end) {
                var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                if (match) { var len = match[0].length; domBuilder.processingInstruction(match[1], match[2]); return end + 2 } else return -1
            } return -1
        } function ElementAttributes(source) { } ElementAttributes.prototype = {
            setTagName: function (tagName) { if (!tagNamePattern.test(tagName)) throw new Error("invalid tagName:" + tagName); this.tagName = tagName }, add: function (qName, value, offset) { if (!tagNamePattern.test(qName)) throw new Error("invalid attribute:" + qName); this[this.length++] = { qName: qName, value: value, offset: offset } }, length: 0, getLocalName: function (i) { return this[i].localName },
            getLocator: function (i) { return this[i].locator }, getQName: function (i) { return this[i].qName }, getURI: function (i) { return this[i].uri }, getValue: function (i) { return this[i].value }
        }; function split(source, start) { var match; var buf = []; var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g; reg.lastIndex = start; reg.exec(source); while (match = reg.exec(source)) { buf.push(match); if (match[1]) return buf } } exports.XMLReader = XMLReader
})();
(function () {
    var exports = self["xmlDomLib"]; var XMLReader = exports.XMLReader; var DOMImplementation = exports.DOMImplementation; var defaultEntityMap = {
        lt: "<", gt: ">", amp: "&", quot: '"', apos: "'", Agrave: "\u00c0", Aacute: "\u00c1", Acirc: "\u00c2", Atilde: "\u00c3", Auml: "\u00c4", Aring: "\u00c5", AElig: "\u00c6", Ccedil: "\u00c7", Egrave: "\u00c8", Eacute: "\u00c9", Ecirc: "\u00ca", Euml: "\u00cb", Igrave: "\u00cc", Iacute: "\u00cd", Icirc: "\u00ce", Iuml: "\u00cf", ETH: "\u00d0", Ntilde: "\u00d1", Ograve: "\u00d2", Oacute: "\u00d3", Ocirc: "\u00d4",
        Otilde: "\u00d5", Ouml: "\u00d6", Oslash: "\u00d8", Ugrave: "\u00d9", Uacute: "\u00da", Ucirc: "\u00db", Uuml: "\u00dc", Yacute: "\u00dd", THORN: "\u00de", szlig: "\u00df", agrave: "\u00e0", aacute: "\u00e1", acirc: "\u00e2", atilde: "\u00e3", auml: "\u00e4", aring: "\u00e5", aelig: "\u00e6", ccedil: "\u00e7", egrave: "\u00e8", eacute: "\u00e9", ecirc: "\u00ea", euml: "\u00eb", igrave: "\u00ec", iacute: "\u00ed", icirc: "\u00ee", iuml: "\u00ef", eth: "\u00f0", ntilde: "\u00f1", ograve: "\u00f2", oacute: "\u00f3", ocirc: "\u00f4", otilde: "\u00f5", ouml: "\u00f6",
        oslash: "\u00f8", ugrave: "\u00f9", uacute: "\u00fa", ucirc: "\u00fb", uuml: "\u00fc", yacute: "\u00fd", thorn: "\u00fe", yuml: "\u00ff", nbsp: " ", iexcl: "\u00a1", cent: "\u00a2", pound: "\u00a3", curren: "\u00a4", yen: "\u00a5", brvbar: "\u00a6", sect: "\u00a7", uml: "\u00a8", copy: "\u00a9", ordf: "\u00aa", laquo: "\u00ab", not: "\u00ac", shy: "\u00ad\u00ad", reg: "\u00ae", macr: "\u00af", deg: "\u00b0", plusmn: "\u00b1", sup2: "\u00b2", sup3: "\u00b3", acute: "\u00b4", micro: "\u00b5", para: "\u00b6", middot: "\u00b7", cedil: "\u00b8", sup1: "\u00b9", ordm: "\u00ba",
        raquo: "\u00bb", frac14: "\u00bc", frac12: "\u00bd", frac34: "\u00be", iquest: "\u00bf", times: "\u00d7", divide: "\u00f7", forall: "\u2200", part: "\u2202", exist: "\u2203", empty: "\u2205", nabla: "\u2207", isin: "\u2208", notin: "\u2209", ni: "\u220b", prod: "\u220f", sum: "\u2211", minus: "\u2212", lowast: "\u2217", radic: "\u221a", prop: "\u221d", infin: "\u221e", ang: "\u2220", and: "\u2227", or: "\u2228", cap: "\u2229", cup: "\u222a", "int": "\u222b", there4: "\u2234", sim: "\u223c", cong: "\u2245", asymp: "\u2248", ne: "\u2260", equiv: "\u2261", le: "\u2264",
        ge: "\u2265", sub: "\u2282", sup: "\u2283", nsub: "\u2284", sube: "\u2286", supe: "\u2287", oplus: "\u2295", otimes: "\u2297", perp: "\u22a5", sdot: "\u22c5", Alpha: "\u0391", Beta: "\u0392", Gamma: "\u0393", Delta: "\u0394", Epsilon: "\u0395", Zeta: "\u0396", Eta: "\u0397", Theta: "\u0398", Iota: "\u0399", Kappa: "\u039a", Lambda: "\u039b", Mu: "\u039c", Nu: "\u039d", Xi: "\u039e", Omicron: "\u039f", Pi: "\u03a0", Rho: "\u03a1", Sigma: "\u03a3", Tau: "\u03a4", Upsilon: "\u03a5", Phi: "\u03a6", Chi: "\u03a7", Psi: "\u03a8", Omega: "\u03a9", alpha: "\u03b1", beta: "\u03b2",
        gamma: "\u03b3", delta: "\u03b4", epsilon: "\u03b5", zeta: "\u03b6", eta: "\u03b7", theta: "\u03b8", iota: "\u03b9", kappa: "\u03ba", lambda: "\u03bb", mu: "\u03bc", nu: "\u03bd", xi: "\u03be", omicron: "\u03bf", pi: "\u03c0", rho: "\u03c1", sigmaf: "\u03c2", sigma: "\u03c3", tau: "\u03c4", upsilon: "\u03c5", phi: "\u03c6", chi: "\u03c7", psi: "\u03c8", omega: "\u03c9", thetasym: "\u03d1", upsih: "\u03d2", piv: "\u03d6", OElig: "\u0152", oelig: "\u0153", Scaron: "\u0160", scaron: "\u0161", Yuml: "\u0178", fnof: "\u0192", circ: "\u02c6", tilde: "\u02dc", ensp: "\u2002",
        emsp: "\u2003", thinsp: "\u2009", zwnj: "\u200c", zwj: "\u200d", lrm: "\u200e", rlm: "\u200f", ndash: "\u2013", mdash: "\u2014", lsquo: "\u2018", rsquo: "\u2019", sbquo: "\u201a", ldquo: "\u201c", rdquo: "\u201d", bdquo: "\u201e", dagger: "\u2020", Dagger: "\u2021", bull: "\u2022", hellip: "\u2026", permil: "\u2030", prime: "\u2032", Prime: "\u2033", lsaquo: "\u2039", rsaquo: "\u203a", oline: "\u203e", euro: "\u20ac", trade: "\u2122", larr: "\u2190", uarr: "\u2191", rarr: "\u2192", darr: "\u2193", harr: "\u2194", crarr: "\u21b5", lceil: "\u2308", rceil: "\u2309",
        lfloor: "\u230a", rfloor: "\u230b", loz: "\u25ca", spades: "\u2660", clubs: "\u2663", hearts: "\u2665", diams: "\u2666"
    }; function DOMParser(options) { this.options = options || { locator: {} } } DOMParser.prototype.parseFromString = function (source, mimeType) {
        var options = this.options; var sax = new XMLReader; var domBuilder = options.domBuilder || new DOMHandler; var errorHandler = options.errorHandler; var locator = options.locator; var defaultNSMap = options.xmlns || {}; var isHTML = /\/x?html?$/.test(mimeType); var entityMap = isHTML ? defaultEntityMap :
            { "lt": "<", "gt": ">", "amp": "&", "quot": '"', "apos": "'" }; if (locator) domBuilder.setDocumentLocator(locator); sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator); sax.domBuilder = options.domBuilder || domBuilder; if (isHTML) defaultNSMap[""] = "http://www.w3.org/1999/xhtml"; defaultNSMap.xml = defaultNSMap.xml || "http://www.w3.org/XML/1998/namespace"; if (source) sax.parse(source, defaultNSMap, entityMap); else sax.errorHandler.error("invalid doc source"); return domBuilder.doc
    }; function buildErrorHandler(errorImpl,
        domBuilder, locator) { if (!errorImpl) { if (domBuilder instanceof DOMHandler) return domBuilder; errorImpl = domBuilder } var errorHandler = {}; var isCallback = errorImpl instanceof Function; locator = locator || {}; function build(key) { var fn = errorImpl[key]; if (!fn && isCallback) fn = errorImpl.length == 2 ? function (msg) { errorImpl(key, msg) } : errorImpl; errorHandler[key] = fn && function (msg) { fn("[xmldom " + key + "]\t" + msg + _locator(locator)) } || function () { } } build("warning"); build("error"); build("fatalError"); return errorHandler } function DOMHandler() {
            this.cdata =
                false
        } function position(locator, node) { node.lineNumber = locator.lineNumber; node.columnNumber = locator.columnNumber } DOMHandler.prototype = {
            startDocument: function () { this.doc = (new DOMImplementation).createDocument(null, null, null); if (this.locator) this.doc.documentURI = this.locator.systemId }, startElement: function (namespaceURI, localName, qName, attrs) {
                var doc = this.doc; var el = doc.createElementNS(namespaceURI, qName || localName); var len = attrs.length; appendElement(this, el); this.currentElement = el; this.locator && position(this.locator,
                    el); for (var i = 0; i < len; i++) { var namespaceURI = attrs.getURI(i); var value = attrs.getValue(i); var qName = attrs.getQName(i); var attr = doc.createAttributeNS(namespaceURI, qName); this.locator && position(attrs.getLocator(i), attr); attr.value = attr.nodeValue = value; el.setAttributeNode(attr) }
            }, endElement: function (namespaceURI, localName, qName) { var current = this.currentElement; var tagName = current.tagName; this.currentElement = current.parentNode }, startPrefixMapping: function (prefix, uri) { }, endPrefixMapping: function (prefix) { },
            processingInstruction: function (target, data) { var ins = this.doc.createProcessingInstruction(target, data); this.locator && position(this.locator, ins); appendElement(this, ins) }, ignorableWhitespace: function (ch, start, length) { }, characters: function (chars, start, length) {
                chars = _toString.apply(this, arguments); if (chars) {
                    if (this.cdata) var charNode = this.doc.createCDATASection(chars); else var charNode = this.doc.createTextNode(chars); if (this.currentElement) this.currentElement.appendChild(charNode); else if (/^\s*$/.test(chars)) this.doc.appendChild(charNode);
                    this.locator && position(this.locator, charNode)
                }
            }, skippedEntity: function (name) { }, endDocument: function () { this.doc.normalize() }, setDocumentLocator: function (locator) { if (this.locator = locator) locator.lineNumber = 0 }, comment: function (chars, start, length) { chars = _toString.apply(this, arguments); var comm = this.doc.createComment(chars); this.locator && position(this.locator, comm); appendElement(this, comm) }, startCDATA: function () { this.cdata = true }, endCDATA: function () { this.cdata = false }, startDTD: function (name, publicId, systemId) {
                var impl =
                    this.doc.implementation; if (impl && impl.createDocumentType) { var dt = impl.createDocumentType(name, publicId, systemId); this.locator && position(this.locator, dt); appendElement(this, dt) }
            }, warning: function (error) { console.warn("[xmldom warning]\t" + error, _locator(this.locator)) }, error: function (error) { console.error("[xmldom error]\t" + error, _locator(this.locator)) }, fatalError: function (error) { console.error("[xmldom fatalError]\t" + error, _locator(this.locator)); throw error; }
        }; function _locator(l) {
            if (l) return "\n@" +
                (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]"
        } function _toString(chars, start, length) { if (typeof chars == "string") return chars.substr(start, length); else { if (chars.length >= start + length || start) return new java.lang.String(chars, start, length) + ""; return chars } } "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (key) { DOMHandler.prototype[key] = function () { return null } });
    function appendElement(hander, node) { if (!hander.currentElement) hander.doc.appendChild(node); else hander.currentElement.appendChild(node) } exports.DOMParser = DOMParser
})();
