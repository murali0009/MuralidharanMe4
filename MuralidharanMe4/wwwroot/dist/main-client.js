/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "af75a43623d52ec79f72"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(107)(__webpack_require__.s = 107);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(1);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = vendor_db1626bf153ca0acf810;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(45);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__core__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__core__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__core__["c"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__core__["d"]; });


//# sourceMappingURL=index.js.map


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Portal */
/* unused harmony export ComponentPortal */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatePortal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BasePortalHost; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_errors__ = __webpack_require__(22);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
var Portal = (function () {
    function Portal() {
    }
    /** Attach this portal to a host. */
    Portal.prototype.attach = function (host) {
        if (host == null) {
            throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["b" /* MdNullPortalHostError */]();
        }
        if (host.hasAttached()) {
            throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["c" /* MdPortalAlreadyAttachedError */]();
        }
        this._attachedHost = host;
        return host.attach(this);
    };
    /** Detach this portal from its host */
    Portal.prototype.detach = function () {
        var host = this._attachedHost;
        if (host == null) {
            throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["d" /* MdNoPortalAttachedError */]();
        }
        this._attachedHost = null;
        return host.detach();
    };
    Object.defineProperty(Portal.prototype, "isAttached", {
        /** Whether this portal is attached to a host. */
        get: function () {
            return this._attachedHost != null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detatch()`.
     */
    Portal.prototype.setAttachedHost = function (host) {
        this._attachedHost = host;
    };
    return Portal;
}());
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
var ComponentPortal = (function (_super) {
    __extends(ComponentPortal, _super);
    function ComponentPortal(component, viewContainerRef, injector) {
        if (viewContainerRef === void 0) { viewContainerRef = null; }
        if (injector === void 0) { injector = null; }
        _super.call(this);
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
    }
    return ComponentPortal;
}(Portal));
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
var TemplatePortal = (function (_super) {
    __extends(TemplatePortal, _super);
    function TemplatePortal(template, viewContainerRef) {
        _super.call(this);
        /**
         * Additional locals for the instantiated embedded view.
         * These locals can be seen as "exports" for the template, such as how ngFor has
         * index / event / odd.
         * See https://angular.io/docs/ts/latest/api/core/EmbeddedViewRef-class.html
         */
        this.locals = new Map();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(TemplatePortal.prototype, "origin", {
        get: function () {
            return this.templateRef.elementRef;
        },
        enumerable: true,
        configurable: true
    });
    TemplatePortal.prototype.attach = function (host, locals) {
        this.locals = locals == null ? new Map() : locals;
        return _super.prototype.attach.call(this, host);
    };
    TemplatePortal.prototype.detach = function () {
        this.locals = new Map();
        return _super.prototype.detach.call(this);
    };
    return TemplatePortal;
}(Portal));
/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
var BasePortalHost = (function () {
    function BasePortalHost() {
        /** Whether this host has already been permanently disposed. */
        this._isDisposed = false;
    }
    /** Whether this host has an attached portal. */
    BasePortalHost.prototype.hasAttached = function () {
        return this._attachedPortal != null;
    };
    BasePortalHost.prototype.attach = function (portal) {
        if (portal == null) {
            throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["e" /* MdNullPortalError */]();
        }
        if (this.hasAttached()) {
            throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["c" /* MdPortalAlreadyAttachedError */]();
        }
        if (this._isDisposed) {
            throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["f" /* MdPortalHostAlreadyDisposedError */]();
        }
        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        }
        else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }
        throw new __WEBPACK_IMPORTED_MODULE_0__portal_errors__["g" /* MdUnknownPortalTypeError */]();
    };
    BasePortalHost.prototype.detach = function () {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
        }
        this._attachedPortal = null;
        if (this._disposeFn != null) {
            this._disposeFn();
            this._disposeFn = null;
        }
    };
    BasePortalHost.prototype.dispose = function () {
        if (this.hasAttached()) {
            this.detach();
        }
        this._isDisposed = true;
    };
    BasePortalHost.prototype.setDisposeFn = function (fn) {
        this._disposeFn = fn;
    };
    return BasePortalHost;
}());

//# sourceMappingURL=portal.js.map


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(6);
__webpack_require__(35);
var GithubService = (function () {
    function GithubService(http) {
        this.http = http;
    }
    GithubService.prototype.getOrg = function (org) {
        return this.makeRequest("orgs/" + org);
    };
    GithubService.prototype.getReposForOrg = function (org) {
        return this.makeRequest("orgs/" + org + "/repos");
    };
    GithubService.prototype.getRepoForOrg = function (org, repo) {
        return this.makeRequest("repos/" + org + "/" + repo);
    };
    GithubService.prototype.makeRequest = function (path) {
        var params = new http_1.URLSearchParams();
        params.set('per_page', '100');
        var url = "https://api.github.com/" + path;
        return this.http.get(url, { search: params })
            .map(function (res) { return res.json(); });
    };
    return GithubService;
}());
GithubService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GithubService);
exports.GithubService = GithubService;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(123);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(271);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OverlayState; });
/**
 * OverlayState is a bag of values for either the initial configuration or current state of an
 * overlay.
 */
var OverlayState = (function () {
    function OverlayState() {
    }
    return OverlayState;
}());

//# sourceMappingURL=overlay-state.js.map


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectionPositionPair; });
/** The points of the origin element and the overlay element to connect. */
var ConnectionPositionPair = (function () {
    function ConnectionPositionPair(origin, overlay) {
        this.originX = origin.originX;
        this.originY = origin.originY;
        this.overlayX = overlay.overlayX;
        this.overlayY = overlay.overlayY;
    }
    return ConnectionPositionPair;
}());

//# sourceMappingURL=connected-position.js.map


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TemplatePortalDirective */
/* unused harmony export PortalHostDirective */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PortalModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal__ = __webpack_require__(4);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Directive version of a `TemplatePortal`. Because the directive *is* a TemplatePortal,
 * the directive instance itself can be attached to a host, enabling declarative use of portals.
 *
 * Usage:
 * <template portal #greeting>
 *   <p> Hello {{name}} </p>
 * </template>
 */
var TemplatePortalDirective = (function (_super) {
    __extends(TemplatePortalDirective, _super);
    function TemplatePortalDirective(templateRef, viewContainerRef) {
        _super.call(this, templateRef, viewContainerRef);
    }
    TemplatePortalDirective = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[portal]',
            exportAs: 'portal',
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"]])
    ], TemplatePortalDirective);
    return TemplatePortalDirective;
}(__WEBPACK_IMPORTED_MODULE_1__portal__["a" /* TemplatePortal */]));
/**
 * Directive version of a PortalHost. Because the directive *is* a PortalHost, portals can be
 * directly attached to it, enabling declarative use.
 *
 * Usage:
 * <template [portalHost]="greeting"></template>
 */
var PortalHostDirective = (function (_super) {
    __extends(PortalHostDirective, _super);
    function PortalHostDirective(_componentFactoryResolver, _viewContainerRef) {
        _super.call(this);
        this._componentFactoryResolver = _componentFactoryResolver;
        this._viewContainerRef = _viewContainerRef;
    }
    Object.defineProperty(PortalHostDirective.prototype, "portal", {
        get: function () {
            return this._portal;
        },
        set: function (p) {
            this._replaceAttachedPortal(p);
        },
        enumerable: true,
        configurable: true
    });
    /** Attach the given ComponentPortal to this PortlHost using the ComponentFactoryResolver. */
    PortalHostDirective.prototype.attachComponentPortal = function (portal) {
        portal.setAttachedHost(this);
        // If the portal specifies an origin, use that as the logical location of the component
        // in the application tree. Otherwise use the location of this PortalHost.
        var viewContainerRef = portal.viewContainerRef != null ?
            portal.viewContainerRef :
            this._viewContainerRef;
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
        var ref = viewContainerRef.createComponent(componentFactory, viewContainerRef.length, portal.injector || viewContainerRef.parentInjector);
        this.setDisposeFn(function () { return ref.destroy(); });
        return ref;
    };
    /** Attach the given TemplatePortal to this PortlHost as an embedded View. */
    PortalHostDirective.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        portal.setAttachedHost(this);
        this._viewContainerRef.createEmbeddedView(portal.templateRef);
        this.setDisposeFn(function () { return _this._viewContainerRef.clear(); });
        // TODO(jelbourn): return locals from view
        return new Map();
    };
    /** Detatches the currently attached Portal (if there is one) and attaches the given Portal. */
    PortalHostDirective.prototype._replaceAttachedPortal = function (p) {
        if (this.hasAttached()) {
            this.detach();
        }
        if (p) {
            this.attach(p);
            this._portal = p;
        }
    };
    PortalHostDirective = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[portalHost]',
            inputs: ['portal: portalHost']
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ComponentFactoryResolver"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"]])
    ], PortalHostDirective);
    return PortalHostDirective;
}(__WEBPACK_IMPORTED_MODULE_1__portal__["b" /* BasePortalHost */]));
var PortalModule = (function () {
    function PortalModule() {
    }
    PortalModule.forRoot = function () {
        return {
            ngModule: PortalModule,
            providers: []
        };
    };
    PortalModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [TemplatePortalDirective, PortalHostDirective],
            declarations: [TemplatePortalDirective, PortalHostDirective],
        }), 
        __metadata('design:paramtypes', [])
    ], PortalModule);
    return PortalModule;
}());

//# sourceMappingURL=portal-directives.js.map


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(40);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export LIVE_ANNOUNCER_ELEMENT_TOKEN */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdLiveAnnouncer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

var LIVE_ANNOUNCER_ELEMENT_TOKEN = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('mdLiveAnnouncerElement');
var MdLiveAnnouncer = (function () {
    function MdLiveAnnouncer(elementToken) {
        // We inject the live element as `any` because the constructor signature cannot reference
        // browser globals (HTMLElement) on non-browser environments, since having a class decorator
        // causes TypeScript to preserve the constructor signature types.
        this._liveElement = elementToken || this._createLiveElement();
    }
    /**
     * @param message Message to be announced to the screenreader
     * @param politeness The politeness of the announcer element.
     */
    MdLiveAnnouncer.prototype.announce = function (message, politeness) {
        var _this = this;
        if (politeness === void 0) { politeness = 'polite'; }
        this._liveElement.textContent = '';
        // TODO: ensure changing the politeness works on all environments we support.
        this._liveElement.setAttribute('aria-live', politeness);
        // This 100ms timeout is necessary for some browser + screen-reader combinations:
        // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
        // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
        //   second time without clearing and then using a non-zero delay.
        // (using JAWS 17 at time of this writing).
        setTimeout(function () { return _this._liveElement.textContent = message; }, 100);
    };
    MdLiveAnnouncer.prototype._createLiveElement = function () {
        var liveEl = document.createElement('div');
        liveEl.classList.add('md-live-announcer');
        liveEl.setAttribute('aria-atomic', 'true');
        liveEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveEl);
        return liveEl;
    };
    MdLiveAnnouncer = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"])()),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(LIVE_ANNOUNCER_ELEMENT_TOKEN)), 
        __metadata('design:paramtypes', [Object])
    ], MdLiveAnnouncer);
    return MdLiveAnnouncer;
}());

//# sourceMappingURL=live-announcer.js.map


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdError; });
// TODO(kara): Revisit why error messages are not being properly set.
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Wrapper around Error that sets the error message.
 */
var MdError = (function (_super) {
    __extends(MdError, _super);
    function MdError(value) {
        _super.call(this);
        this.message = value;
    }
    return MdError;
}(Error));

//# sourceMappingURL=error.js.map


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MdLine */
/* unused harmony export MdLineSetter */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdLineModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MdLine) query, then
 * counted by checking the query list's length.
 */
var MdLine = (function () {
    function MdLine() {
    }
    MdLine = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({ selector: '[md-line]' }), 
        __metadata('design:paramtypes', [])
    ], MdLine);
    return MdLine;
}());
/* Helper that takes a query list of lines and sets the correct class on the host */
var MdLineSetter = (function () {
    function MdLineSetter(_lines, _renderer, _element) {
        var _this = this;
        this._lines = _lines;
        this._renderer = _renderer;
        this._element = _element;
        this._setLineClass(this._lines.length);
        this._lines.changes.subscribe(function () {
            _this._setLineClass(_this._lines.length);
        });
    }
    MdLineSetter.prototype._setLineClass = function (count) {
        this._resetClasses();
        if (count === 2 || count === 3) {
            this._setClass("md-" + count + "-line", true);
        }
    };
    MdLineSetter.prototype._resetClasses = function () {
        this._setClass('md-2-line', false);
        this._setClass('md-3-line', false);
    };
    MdLineSetter.prototype._setClass = function (className, bool) {
        this._renderer.setElementClass(this._element.nativeElement, className, bool);
    };
    return MdLineSetter;
}());
var MdLineModule = (function () {
    function MdLineModule() {
    }
    MdLineModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [MdLine],
            declarations: [MdLine],
        }), 
        __metadata('design:paramtypes', [])
    ], MdLineModule);
    return MdLineModule;
}());

//# sourceMappingURL=line.js.map


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OverlayContainer; });
/**
 * The OverlayContainer is the container in which all overlays will load.
 * It should be provided in the root component to ensure it is properly shared.
 */
var OverlayContainer = (function () {
    function OverlayContainer() {
    }
    /**
     * This method returns the overlay container element.  It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @returns {HTMLElement} the container element
     */
    OverlayContainer.prototype.getContainerElement = function () {
        if (!this._containerElement) {
            this._createContainer();
        }
        return this._containerElement;
    };
    /**
     * Create the overlay container element, which is simply a div
     * with the 'md-overlay-container' class on the document body.
     */
    OverlayContainer.prototype._createContainer = function () {
        var container = document.createElement('div');
        container.classList.add('md-overlay-container');
        document.body.appendChild(container);
        this._containerElement = container;
    };
    return OverlayContainer;
}());

//# sourceMappingURL=overlay-container.js.map


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export OverlayOrigin */
/* unused harmony export ConnectedOverlayDirective */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OverlayModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__overlay__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__portal_portal__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__overlay_state__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__position_connected_position__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__portal_portal_directives__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/** Default set of positions for the overlay. Follows the behavior of a dropdown. */
var defaultPositionList = [
    new __WEBPACK_IMPORTED_MODULE_4__position_connected_position__["a" /* ConnectionPositionPair */]({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new __WEBPACK_IMPORTED_MODULE_4__position_connected_position__["a" /* ConnectionPositionPair */]({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
];
/**
 * Directive applied to an element to make it usable as an origin for an Overlay using a
 * ConnectedPositionStrategy.
 */
var OverlayOrigin = (function () {
    function OverlayOrigin(_elementRef) {
        this._elementRef = _elementRef;
    }
    Object.defineProperty(OverlayOrigin.prototype, "elementRef", {
        get: function () {
            return this._elementRef;
        },
        enumerable: true,
        configurable: true
    });
    OverlayOrigin = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[overlay-origin]',
            exportAs: 'overlayOrigin',
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
    ], OverlayOrigin);
    return OverlayOrigin;
}());
/**
 * Directive to facilitate declarative creation of an Overlay using a ConnectedPositionStrategy.
 */
var ConnectedOverlayDirective = (function () {
    // TODO(jelbourn): inputs for size, scroll behavior, animation, etc.
    function ConnectedOverlayDirective(_overlay, templateRef, viewContainerRef) {
        this._overlay = _overlay;
        this._templatePortal = new __WEBPACK_IMPORTED_MODULE_2__portal_portal__["a" /* TemplatePortal */](templateRef, viewContainerRef);
    }
    Object.defineProperty(ConnectedOverlayDirective.prototype, "overlayRef", {
        get: function () {
            return this._overlayRef;
        },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    ConnectedOverlayDirective.prototype.ngOnInit = function () {
        this._createOverlay();
    };
    /** TODO: internal */
    ConnectedOverlayDirective.prototype.ngOnDestroy = function () {
        this._destroyOverlay();
    };
    /** Creates an overlay and attaches this directive's template to it. */
    ConnectedOverlayDirective.prototype._createOverlay = function () {
        if (!this.positions || !this.positions.length) {
            this.positions = defaultPositionList;
        }
        var overlayConfig = new __WEBPACK_IMPORTED_MODULE_3__overlay_state__["a" /* OverlayState */]();
        overlayConfig.positionStrategy =
            this._overlay.position().connectedTo(this.origin.elementRef, { originX: this.positions[0].overlayX, originY: this.positions[0].originY }, { overlayX: this.positions[0].overlayX, overlayY: this.positions[0].overlayY });
        this._overlayRef = this._overlay.create(overlayConfig);
        this._overlayRef.attach(this._templatePortal);
    };
    /** Destroys the overlay created by this directive. */
    ConnectedOverlayDirective.prototype._destroyOverlay = function () {
        this._overlayRef.dispose();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', OverlayOrigin)
    ], ConnectedOverlayDirective.prototype, "origin", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', Array)
    ], ConnectedOverlayDirective.prototype, "positions", void 0);
    ConnectedOverlayDirective = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[connected-overlay]'
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_1__overlay__["a" /* Overlay */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"]])
    ], ConnectedOverlayDirective);
    return ConnectedOverlayDirective;
}());
var OverlayModule = (function () {
    function OverlayModule() {
    }
    OverlayModule.forRoot = function () {
        return {
            ngModule: OverlayModule,
            providers: __WEBPACK_IMPORTED_MODULE_1__overlay__["b" /* OVERLAY_PROVIDERS */],
        };
    };
    OverlayModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_5__portal_portal_directives__["a" /* PortalModule */]],
            exports: [ConnectedOverlayDirective, OverlayOrigin],
            declarations: [ConnectedOverlayDirective, OverlayOrigin],
        }), 
        __metadata('design:paramtypes', [])
    ], OverlayModule);
    return OverlayModule;
}());

//# sourceMappingURL=overlay-directives.js.map


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OverlayRef; });
/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
var OverlayRef = (function () {
    function OverlayRef(_portalHost, _pane, _state) {
        this._portalHost = _portalHost;
        this._pane = _pane;
        this._state = _state;
    }
    OverlayRef.prototype.attach = function (portal) {
        var attachResult = this._portalHost.attach(portal);
        this.updatePosition();
        return attachResult;
    };
    OverlayRef.prototype.detach = function () {
        return this._portalHost.detach();
    };
    OverlayRef.prototype.dispose = function () {
        this._portalHost.dispose();
    };
    OverlayRef.prototype.hasAttached = function () {
        return this._portalHost.hasAttached();
    };
    /** Gets the current state config of the overlay. */
    OverlayRef.prototype.getState = function () {
        return this._state;
    };
    /** Updates the position of the overlay based on the position strategy. */
    OverlayRef.prototype.updatePosition = function () {
        if (this._state.positionStrategy) {
            this._state.positionStrategy.apply(this._pane);
        }
    };
    return OverlayRef;
}());

//# sourceMappingURL=overlay-ref.js.map


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Overlay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return OVERLAY_PROVIDERS; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__overlay_state__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__portal_dom_portal_host__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__overlay_ref__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__position_overlay_position_builder__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__position_viewport_ruler__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__overlay_container__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/** Next overlay unique ID. */
var nextUniqueId = 0;
/** The default state for newly created overlays. */
var defaultState = new __WEBPACK_IMPORTED_MODULE_1__overlay_state__["a" /* OverlayState */]();
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
var Overlay = (function () {
    function Overlay(_overlayContainer, _componentFactoryResolver, _positionBuilder) {
        this._overlayContainer = _overlayContainer;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._positionBuilder = _positionBuilder;
    }
    /**
     * Creates an overlay.
     * @param state State to apply to the overlay.
     * @returns A reference to the created overlay.
     */
    Overlay.prototype.create = function (state) {
        if (state === void 0) { state = defaultState; }
        return this._createOverlayRef(this._createPaneElement(), state);
    };
    /**
     * Returns a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     */
    Overlay.prototype.position = function () {
        return this._positionBuilder;
    };
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @returns Promise resolving to the created element.
     */
    Overlay.prototype._createPaneElement = function () {
        var pane = document.createElement('div');
        pane.id = "md-overlay-" + nextUniqueId++;
        pane.classList.add('md-overlay-pane');
        this._overlayContainer.getContainerElement().appendChild(pane);
        return pane;
    };
    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param pane The DOM element to turn into a portal host.
     * @returns A portal host for the given DOM element.
     */
    Overlay.prototype._createPortalHost = function (pane) {
        return new __WEBPACK_IMPORTED_MODULE_2__portal_dom_portal_host__["a" /* DomPortalHost */](pane, this._componentFactoryResolver);
    };
    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param pane DOM element for the overlay
     * @param state
     * @returns {OverlayRef}
     */
    Overlay.prototype._createOverlayRef = function (pane, state) {
        return new __WEBPACK_IMPORTED_MODULE_3__overlay_ref__["a" /* OverlayRef */](this._createPortalHost(pane), pane, state);
    };
    Overlay = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_6__overlay_container__["a" /* OverlayContainer */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["ComponentFactoryResolver"], __WEBPACK_IMPORTED_MODULE_4__position_overlay_position_builder__["a" /* OverlayPositionBuilder */]])
    ], Overlay);
    return Overlay;
}());
/** Providers for Overlay and its related injectables. */
var OVERLAY_PROVIDERS = [
    __WEBPACK_IMPORTED_MODULE_5__position_viewport_ruler__["a" /* ViewportRuler */],
    __WEBPACK_IMPORTED_MODULE_4__position_overlay_position_builder__["a" /* OverlayPositionBuilder */],
    Overlay,
    __WEBPACK_IMPORTED_MODULE_6__overlay_container__["a" /* OverlayContainer */],
];

//# sourceMappingURL=overlay.js.map


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectedPositionStrategy; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular2_material_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connected_position__ = __webpack_require__(9);


/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * implict position relative some origin element. The relative position is defined in terms of
 * a point on the origin element that is connected to a point on the overlay element. For example,
 * a basic dropdown is connecting the bottom-left corner of the origin to the top-left corner
 * of the overlay.
 */
var ConnectedPositionStrategy = (function () {
    function ConnectedPositionStrategy(_connectedTo, _originPos, _overlayPos, _viewportRuler) {
        this._connectedTo = _connectedTo;
        this._originPos = _originPos;
        this._overlayPos = _overlayPos;
        this._viewportRuler = _viewportRuler;
        // TODO(jelbourn): set RTL to the actual value from the app.
        /** Whether the we're dealing with an RTL context */
        this._isRtl = false;
        /** Ordered list of preferred positions, from most to least desirable. */
        this._preferredPositions = [];
        this._origin = this._connectedTo.nativeElement;
        this.withFallbackPosition(_originPos, _overlayPos);
    }
    Object.defineProperty(ConnectedPositionStrategy.prototype, "positions", {
        get: function () {
            return this._preferredPositions;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * TODO: internal
     */
    ConnectedPositionStrategy.prototype.apply = function (element) {
        // We need the bounding rects for the origin and the overlay to determine how to position
        // the overlay relative to the origin.
        var originRect = this._origin.getBoundingClientRect();
        var overlayRect = element.getBoundingClientRect();
        // We use the viewport rect to determine whether a position would go off-screen.
        var viewportRect = this._viewportRuler.getViewportRect();
        var firstOverlayPoint = null;
        // We want to place the overlay in the first of the preferred positions such that the
        // overlay fits on-screen.
        for (var _i = 0, _a = this._preferredPositions; _i < _a.length; _i++) {
            var pos = _a[_i];
            // Get the (x, y) point of connection on the origin, and then use that to get the
            // (top, left) coordinate for the overlay at `pos`.
            var originPoint = this._getOriginConnectionPoint(originRect, pos);
            var overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
            firstOverlayPoint = firstOverlayPoint || overlayPoint;
            // If the overlay in the calculated position fits on-screen, put it there and we're done.
            if (this._willOverlayFitWithinViewport(overlayPoint, overlayRect, viewportRect)) {
                this._setElementPosition(element, overlayPoint);
                return Promise.resolve(null);
            }
        }
        // TODO(jelbourn): fallback behavior for when none of the preferred positions fit on-screen.
        // For now, just stick it in the first position and let it go off-screen.
        this._setElementPosition(element, firstOverlayPoint);
        return Promise.resolve(null);
    };
    ConnectedPositionStrategy.prototype.withFallbackPosition = function (originPos, overlayPos) {
        this._preferredPositions.push(new __WEBPACK_IMPORTED_MODULE_1__connected_position__["a" /* ConnectionPositionPair */](originPos, overlayPos));
        return this;
    };
    /**
     * Gets the horizontal (x) "start" dimension based on whether the overlay is in an RTL context.
     * @param rect
     */
    ConnectedPositionStrategy.prototype._getStartX = function (rect) {
        return this._isRtl ? rect.right : rect.left;
    };
    /**
     * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
     * @param rect
     */
    ConnectedPositionStrategy.prototype._getEndX = function (rect) {
        return this._isRtl ? rect.left : rect.right;
    };
    /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     * @param originRect
     * @param pos
     */
    ConnectedPositionStrategy.prototype._getOriginConnectionPoint = function (originRect, pos) {
        var originStartX = this._getStartX(originRect);
        var originEndX = this._getEndX(originRect);
        var x;
        if (pos.originX == 'center') {
            x = originStartX + (originRect.width / 2);
        }
        else {
            x = pos.originX == 'start' ? originStartX : originEndX;
        }
        var y;
        if (pos.originY == 'center') {
            y = originRect.top + (originRect.height / 2);
        }
        else {
            y = pos.originY == 'top' ? originRect.top : originRect.bottom;
        }
        return { x: x, y: y };
    };
    /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected.
     * @param originPoint
     * @param overlayRect
     * @param pos
     */
    ConnectedPositionStrategy.prototype._getOverlayPoint = function (originPoint, overlayRect, pos) {
        // Calculate the (overlayStartX, overlayStartY), the start of the potential overlay position
        // relative to the origin point.
        var overlayStartX;
        if (pos.overlayX == 'center') {
            overlayStartX = -overlayRect.width / 2;
        }
        else {
            overlayStartX = pos.overlayX == 'start' ? 0 : -overlayRect.width;
        }
        var overlayStartY;
        if (pos.overlayY == 'center') {
            overlayStartY = -overlayRect.height / 2;
        }
        else {
            overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
        }
        return {
            x: originPoint.x + overlayStartX,
            y: originPoint.y + overlayStartY
        };
    };
    /**
     * Gets whether the overlay positioned at the given point will fit on-screen.
     * @param overlayPoint The top-left coordinate of the overlay.
     * @param overlayRect Bounding rect of the overlay, used to get its size.
     * @param viewportRect The bounding viewport.
     */
    ConnectedPositionStrategy.prototype._willOverlayFitWithinViewport = function (overlayPoint, overlayRect, viewportRect) {
        // TODO(jelbourn): probably also want some space between overlay edge and viewport edge.
        return overlayPoint.x >= viewportRect.left &&
            overlayPoint.x + overlayRect.width <= viewportRect.right &&
            overlayPoint.y >= viewportRect.top &&
            overlayPoint.y + overlayRect.height <= viewportRect.bottom;
    };
    /**
     * Physically positions the overlay element to the given coordinate.
     * @param element
     * @param overlayPoint
     */
    ConnectedPositionStrategy.prototype._setElementPosition = function (element, overlayPoint) {
        var scrollPos = this._viewportRuler.getViewportScrollPosition();
        var x = overlayPoint.x + scrollPos.left;
        var y = overlayPoint.y + scrollPos.top;
        // TODO(jelbourn): we don't want to always overwrite the transform property here,
        // because it will need to be used for animations.
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular2_material_core__["c" /* applyCssTransform */])(element, "translateX(" + x + "px) translateY(" + y + "px)");
    };
    return ConnectedPositionStrategy;
}());

//# sourceMappingURL=connected-position-strategy.js.map


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ViewportRuler; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Simple utility for getting the bounds of the browser viewport.
 * TODO: internal
 */
var ViewportRuler = (function () {
    function ViewportRuler() {
    }
    // TODO(jelbourn): cache the document's bounding rect and only update it when the window
    // is resized (debounced).
    /** Gets a ClientRect for the viewport's bounds. */
    ViewportRuler.prototype.getViewportRect = function () {
        // Use the document element's bounding rect rather than the window scroll properties
        // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
        // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
        // conceptual viewports. Under most circumstances these viewports are equivalent, but they
        // can disagree when the page is pinch-zoomed (on devices that support touch).
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
        // We use the documentElement instead of the body because, by default (without a css reset)
        // browsers typically give the document body an 8px margin, which is not included in
        // getBoundingClientRect().
        var documentRect = document.documentElement.getBoundingClientRect();
        var scrollPosition = this.getViewportScrollPosition(documentRect);
        var height = window.innerHeight;
        var width = window.innerWidth;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
        };
    };
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @param documentRect
     */
    ViewportRuler.prototype.getViewportScrollPosition = function (documentRect) {
        if (documentRect === void 0) { documentRect = document.documentElement.getBoundingClientRect(); }
        // The top-left-corner of the viewport is determined by the scroll position of the document
        // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
        // whether `document.body` or `document.documentElement` is the scrolled element, so reading
        // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
        // `document.documentElement` works consistently, where the `top` and `left` values will
        // equal negative the scroll position.
        var top = documentRect.top < 0 && document.body.scrollTop == 0 ?
            -documentRect.top :
            document.body.scrollTop;
        var left = documentRect.left < 0 && document.body.scrollLeft == 0 ?
            -documentRect.left :
            document.body.scrollLeft;
        return { top: top, left: left };
    };
    ViewportRuler = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [])
    ], ViewportRuler);
    return ViewportRuler;
}());

//# sourceMappingURL=viewport-ruler.js.map


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DomPortalHost; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_errors__ = __webpack_require__(22);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
var DomPortalHost = (function (_super) {
    __extends(DomPortalHost, _super);
    function DomPortalHost(_hostDomElement, _componentFactoryResolver) {
        _super.call(this);
        this._hostDomElement = _hostDomElement;
        this._componentFactoryResolver = _componentFactoryResolver;
    }
    /** Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver. */
    DomPortalHost.prototype.attachComponentPortal = function (portal) {
        if (portal.viewContainerRef == null) {
            throw new __WEBPACK_IMPORTED_MODULE_1__portal_errors__["a" /* MdComponentPortalAttachedToDomWithoutOriginError */]();
        }
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
        var ref = portal.viewContainerRef.createComponent(componentFactory, portal.viewContainerRef.length, portal.injector || portal.viewContainerRef.parentInjector);
        var hostView = ref.hostView;
        this._hostDomElement.appendChild(hostView.rootNodes[0]);
        this.setDisposeFn(function () { return ref.destroy(); });
        return ref;
    };
    DomPortalHost.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        var viewContainer = portal.viewContainerRef;
        var viewRef = viewContainer.createEmbeddedView(portal.templateRef);
        viewRef.rootNodes.forEach(function (rootNode) { return _this._hostDomElement.appendChild(rootNode); });
        this.setDisposeFn((function () {
            var index = viewContainer.indexOf(viewRef);
            if (index != -1) {
                viewContainer.remove(index);
            }
        }));
        // TODO(jelbourn): Return locals from view.
        return new Map();
    };
    DomPortalHost.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._hostDomElement.parentNode != null) {
            this._hostDomElement.parentNode.removeChild(this._hostDomElement);
        }
    };
    return DomPortalHost;
}(__WEBPACK_IMPORTED_MODULE_0__portal__["b" /* BasePortalHost */]));

//# sourceMappingURL=dom-portal-host.js.map


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdComponentPortalAttachedToDomWithoutOriginError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MdNullPortalError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MdPortalAlreadyAttachedError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return MdPortalHostAlreadyDisposedError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return MdUnknownPortalTypeError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MdNullPortalHostError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MdNoPortalAttachedError; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__errors_error__ = __webpack_require__(13);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/** Exception thrown when a ComponentPortal is attached to a DomPortalHost without an origin. */
var MdComponentPortalAttachedToDomWithoutOriginError = (function (_super) {
    __extends(MdComponentPortalAttachedToDomWithoutOriginError, _super);
    function MdComponentPortalAttachedToDomWithoutOriginError() {
        _super.call(this, 'A ComponentPortal must have an origin set when attached to a DomPortalHost ' +
            'because the DOM element is not part of the Angular application context.');
    }
    return MdComponentPortalAttachedToDomWithoutOriginError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));
/** Exception thrown when attempting to attach a null portal to a host. */
var MdNullPortalError = (function (_super) {
    __extends(MdNullPortalError, _super);
    function MdNullPortalError() {
        _super.call(this, 'Must provide a portal to attach');
    }
    return MdNullPortalError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));
/** Exception thrown when attempting to attach a portal to a host that is already attached. */
var MdPortalAlreadyAttachedError = (function (_super) {
    __extends(MdPortalAlreadyAttachedError, _super);
    function MdPortalAlreadyAttachedError() {
        _super.call(this, 'Host already has a portal attached');
    }
    return MdPortalAlreadyAttachedError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));
/** Exception thrown when attempting to attach a portal to an already-disposed host. */
var MdPortalHostAlreadyDisposedError = (function (_super) {
    __extends(MdPortalHostAlreadyDisposedError, _super);
    function MdPortalHostAlreadyDisposedError() {
        _super.call(this, 'This PortalHost has already been disposed');
    }
    return MdPortalHostAlreadyDisposedError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));
/** Exception thrown when attempting to attach an unknown portal type. */
var MdUnknownPortalTypeError = (function (_super) {
    __extends(MdUnknownPortalTypeError, _super);
    function MdUnknownPortalTypeError() {
        _super.call(this, 'Attempting to attach an unknown Portal type. ' +
            'BasePortalHost accepts either a ComponentPortal or a TemplatePortal.');
    }
    return MdUnknownPortalTypeError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));
/** Exception thrown when attempting to attach a portal to a null host. */
var MdNullPortalHostError = (function (_super) {
    __extends(MdNullPortalHostError, _super);
    function MdNullPortalHostError() {
        _super.call(this, 'Attempting to attach a portal to a null PortalHost');
    }
    return MdNullPortalHostError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));
/** Exception thrown when attempting to detach a portal that is not attached. */
var MdNoPortalAttachedError = (function (_super) {
    __extends(MdNoPortalAttachedError, _super);
    function MdNoPortalAttachedError() {
        _super.call(this, 'Attempting to detach a portal that is not attached to a host');
    }
    return MdNoPortalAttachedError;
}(__WEBPACK_IMPORTED_MODULE_0__errors_error__["a" /* MdError */]));

//# sourceMappingURL=portal-errors.js.map


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MdRipple */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdRippleModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ripple_renderer__ = __webpack_require__(50);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MdRipple = (function () {
    function MdRipple(_elementRef) {
        var _this = this;
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.maxRadius = 0;
        /**
         * If set, the normal duration of ripple animations is divided by this value. For example,
         * setting it to 0.5 will cause the animations to take twice as long.
         */
        this.speedFactor = 1;
        // These event handlers are attached to the element that triggers the ripple animations.
        var eventHandlers = new Map();
        eventHandlers.set('mousedown', function (event) { return _this._mouseDown(event); });
        eventHandlers.set('click', function (event) { return _this._click(event); });
        eventHandlers.set('mouseleave', function (event) { return _this._mouseLeave(event); });
        this._rippleRenderer = new __WEBPACK_IMPORTED_MODULE_1__ripple_renderer__["a" /* RippleRenderer */](_elementRef, eventHandlers);
    }
    /** TODO: internal */
    MdRipple.prototype.ngOnInit = function () {
        // If no trigger element was explicity set, use the host element
        if (!this.trigger) {
            this._rippleRenderer.setTriggerElementToHost();
        }
    };
    /** TODO: internal */
    MdRipple.prototype.ngOnDestroy = function () {
        // Remove event listeners on the trigger element.
        this._rippleRenderer.clearTriggerElement();
    };
    /** TODO: internal */
    MdRipple.prototype.ngOnChanges = function (changes) {
        // If the trigger element changed (or is being initially set), add event listeners to it.
        var changedInputs = Object.keys(changes);
        if (changedInputs.indexOf('trigger') !== -1) {
            this._rippleRenderer.setTriggerElement(this.trigger);
        }
    };
    /**
     * Responds to the start of a ripple animation trigger by fading the background in.
     */
    MdRipple.prototype.start = function () {
        this._rippleRenderer.fadeInRippleBackground(this.backgroundColor);
    };
    /**
     * Responds to the end of a ripple animation trigger by fading the background out, and creating a
     * foreground ripple that expands from the event location (or from the center of the element if
     * the "centered" property is set or forceCenter is true).
     */
    MdRipple.prototype.end = function (left, top, forceCenter) {
        var _this = this;
        if (forceCenter === void 0) { forceCenter = true; }
        this._rippleRenderer.createForegroundRipple(left, top, this.color, this.centered || forceCenter, this.maxRadius, this.speedFactor, function (ripple, e) { return _this._rippleTransitionEnded(ripple, e); });
        this._rippleRenderer.fadeOutRippleBackground();
    };
    MdRipple.prototype._rippleTransitionEnded = function (ripple, event) {
        if (event.propertyName === 'opacity') {
            // If the ripple finished expanding, start fading it out. If it finished fading out,
            // remove it from the DOM.
            switch (ripple.state) {
                case __WEBPACK_IMPORTED_MODULE_1__ripple_renderer__["b" /* ForegroundRippleState */].EXPANDING:
                    this._rippleRenderer.fadeOutForegroundRipple(ripple.rippleElement);
                    ripple.state = __WEBPACK_IMPORTED_MODULE_1__ripple_renderer__["b" /* ForegroundRippleState */].FADING_OUT;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__ripple_renderer__["b" /* ForegroundRippleState */].FADING_OUT:
                    this._rippleRenderer.removeRippleFromDom(ripple.rippleElement);
                    break;
            }
        }
    };
    /**
     * Called when the trigger element receives a mousedown event. Starts the ripple animation by
     * fading in the background.
     */
    MdRipple.prototype._mouseDown = function (event) {
        if (!this.disabled && event.button === 0) {
            this.start();
        }
    };
    /**
     * Called when the trigger element receives a click event. Creates a foreground ripple and
     * runs its animation.
     */
    MdRipple.prototype._click = function (event) {
        if (!this.disabled && event.button === 0) {
            // If screen and page positions are all 0, this was probably triggered by a keypress.
            // In that case, use the center of the bounding rect as the ripple origin.
            // FIXME: This fails on IE11, which still sets pageX/Y and screenX/Y on keyboard clicks.
            var isKeyEvent = (event.screenX === 0 && event.screenY === 0 && event.pageX === 0 && event.pageY === 0);
            this.end(event.pageX, event.pageY, isKeyEvent);
        }
    };
    /**
     * Called when the trigger element receives a mouseleave event. Fades out the background.
     */
    MdRipple.prototype._mouseLeave = function (event) {
        // We can always fade out the background here; It's a no-op if it was already inactive.
        this._rippleRenderer.fadeOutRippleBackground();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-trigger'), 
        __metadata('design:type', Object)
    ], MdRipple.prototype, "trigger", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-centered'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "centered", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-disabled'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "disabled", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-max-radius'), 
        __metadata('design:type', Number)
    ], MdRipple.prototype, "maxRadius", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-speed-factor'), 
        __metadata('design:type', Number)
    ], MdRipple.prototype, "speedFactor", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-color'), 
        __metadata('design:type', String)
    ], MdRipple.prototype, "color", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-background-color'), 
        __metadata('design:type', String)
    ], MdRipple.prototype, "backgroundColor", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('class.md-ripple-focused'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-focused'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "focused", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('class.md-ripple-unbounded'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('md-ripple-unbounded'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "unbounded", void 0);
    MdRipple = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[md-ripple]',
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
    ], MdRipple);
    return MdRipple;
}());
var MdRippleModule = (function () {
    function MdRippleModule() {
    }
    MdRippleModule.forRoot = function () {
        return {
            ngModule: MdRippleModule,
            providers: []
        };
    };
    MdRippleModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [MdRipple],
            declarations: [MdRipple],
        }), 
        __metadata('design:paramtypes', [])
    ], MdRippleModule);
    return MdRippleModule;
}());

//# sourceMappingURL=ripple.js.map


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Dir */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RtlModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Directive to listen to changes of direction of part of the DOM.
 *
 * Applications should use this directive instead of the native attribute so that Material
 * components can listen on changes of direction.
 */
var Dir = (function () {
    function Dir() {
        this._dir = 'ltr';
        this.dirChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    Object.defineProperty(Dir.prototype, "dir", {
        get: function () {
            return this._dir;
        },
        set: function (v) {
            var old = this._dir;
            this._dir = v;
            if (old != this._dir) {
                this.dirChange.emit(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dir.prototype, "value", {
        get: function () { return this.dir; },
        set: function (v) { this.dir = v; },
        enumerable: true,
        configurable: true
    });
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('dir'), 
        __metadata('design:type', String)
    ], Dir.prototype, "_dir", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(), 
        __metadata('design:type', Object)
    ], Dir.prototype, "dirChange", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('attr.dir'), 
        __metadata('design:type', String)
    ], Dir.prototype, "dir", null);
    Dir = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[dir]',
            // TODO(hansl): maybe `$implicit` isn't the best option here, but for now that's the best we got.
            exportAs: '$implicit'
        }), 
        __metadata('design:paramtypes', [])
    ], Dir);
    return Dir;
}());
var RtlModule = (function () {
    function RtlModule() {
    }
    RtlModule.forRoot = function () {
        return {
            ngModule: RtlModule,
            providers: []
        };
    };
    RtlModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [Dir],
            declarations: [Dir]
        }), 
        __metadata('design:paramtypes', [])
    ], RtlModule);
    return RtlModule;
}());

//# sourceMappingURL=dir.js.map


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MdIconNameNotFoundError */
/* unused harmony export MdIconSvgTagNotFoundError */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdIconRegistry; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular2_material_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_forkJoin__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_forkJoin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_forkJoin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_filter__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_do__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_share__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_share___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_share__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_finally__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_finally___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_finally__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_catch__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_catch__);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












/** Exception thrown when attempting to load an icon with a name that cannot be found. */
var MdIconNameNotFoundError = (function (_super) {
    __extends(MdIconNameNotFoundError, _super);
    function MdIconNameNotFoundError(iconName) {
        _super.call(this, "Unable to find icon with the name \"" + iconName + "\"");
    }
    return MdIconNameNotFoundError;
}(__WEBPACK_IMPORTED_MODULE_2__angular2_material_core__["d" /* MdError */]));
/**
 * Exception thrown when attempting to load SVG content that does not contain the expected
 * <svg> tag.
 */
var MdIconSvgTagNotFoundError = (function (_super) {
    __extends(MdIconSvgTagNotFoundError, _super);
    function MdIconSvgTagNotFoundError() {
        _super.call(this, '<svg> tag not found');
    }
    return MdIconSvgTagNotFoundError;
}(__WEBPACK_IMPORTED_MODULE_2__angular2_material_core__["d" /* MdError */]));
/** Configuration for an icon, including the URL and possibly the cached SVG element. */
var SvgIconConfig = (function () {
    function SvgIconConfig(url) {
        this.url = url;
        this.svgElement = null;
    }
    return SvgIconConfig;
}());
/** Returns the cache key to use for an icon namespace and name. */
var iconKey = function (namespace, name) { return namespace + ':' + name; };
/**
 * Service to register and display icons used by the <md-icon> component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
var MdIconRegistry = (function () {
    function MdIconRegistry(_http) {
        this._http = _http;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /** Cache for icons loaded by direct URLs. */
        this._cachedIconsByUrl = new Map();
        /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
        this._inProgressUrlFetches = new Map();
        /** Map from font identifiers to their CSS class names. Used for icon fonts. */
        this._fontCssClassesByAlias = new Map();
        /**
         * The CSS class to apply when an <md-icon> component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
    }
    /** Registers an icon by URL in the default namespace. */
    MdIconRegistry.prototype.addSvgIcon = function (iconName, url) {
        return this.addSvgIconInNamespace('', iconName, url);
    };
    /** Registers an icon by URL in the specified namespace. */
    MdIconRegistry.prototype.addSvgIconInNamespace = function (namespace, iconName, url) {
        var key = iconKey(namespace, iconName);
        this._svgIconConfigs.set(key, new SvgIconConfig(url));
        return this;
    };
    /** Registers an icon set by URL in the default namespace. */
    MdIconRegistry.prototype.addSvgIconSet = function (url) {
        return this.addSvgIconSetInNamespace('', url);
    };
    /** Registers an icon set by URL in the specified namespace. */
    MdIconRegistry.prototype.addSvgIconSetInNamespace = function (namespace, url) {
        var config = new SvgIconConfig(url);
        if (this._iconSetConfigs.has(namespace)) {
            this._iconSetConfigs.get(namespace).push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    };
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an mdIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the <md-icon> element.
     */
    MdIconRegistry.prototype.registerFontClassAlias = function (alias, className) {
        if (className === void 0) { className = alias; }
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    };
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     */
    MdIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    };
    /**
     * Sets the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MdIconRegistry.prototype.setDefaultFontSetClass = function (className) {
        this._defaultFontSetClass = className;
        return this;
    };
    /**
     * Returns the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MdIconRegistry.prototype.getDefaultFontSetClass = function () {
        return this._defaultFontSetClass;
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     */
    MdIconRegistry.prototype.getSvgIconFromUrl = function (url) {
        var _this = this;
        if (this._cachedIconsByUrl.has(url)) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(cloneSvg(this._cachedIconsByUrl.get(url)));
        }
        return this._loadSvgIconFromConfig(new SvgIconConfig(url))
            .do(function (svg) { return _this._cachedIconsByUrl.set(url, svg); })
            .map(function (svg) { return cloneSvg(svg); });
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an MdIconNameNotFoundError.
     */
    MdIconRegistry.prototype.getNamedSvgIcon = function (name, namespace) {
        if (namespace === void 0) { namespace = ''; }
        // Return (copy of) cached icon if possible.
        var key = iconKey(namespace, name);
        if (this._svgIconConfigs.has(key)) {
            return this._getSvgFromConfig(this._svgIconConfigs.get(key));
        }
        // See if we have any icon sets registered for the namespace.
        var iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(new MdIconNameNotFoundError(key));
    };
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     */
    MdIconRegistry.prototype._getSvgFromConfig = function (config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config)
                .do(function (svg) { return config.svgElement = svg; })
                .map(function (svg) { return cloneSvg(svg); });
        }
    };
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new <svg> element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * MdIconNameNotFoundError if no icon with the specified name can be found.
     */
    MdIconRegistry.prototype._getSvgFromIconSetConfigs = function (name, iconSetConfigs) {
        var _this = this;
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        var namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        var iconSetFetchRequests = iconSetConfigs
            .filter(function (iconSetConfig) { return !iconSetConfig.svgElement; })
            .map(function (iconSetConfig) {
            return _this._loadSvgIconSetFromConfig(iconSetConfig)
                .catch(function (err, caught) {
                // Swallow errors fetching individual URLs so the combined Observable won't
                // necessarily fail.
                console.log("Loading icon set URL: " + iconSetConfig.url + " failed: " + err);
                return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(null);
            })
                .do(function (svg) {
                // Cache SVG element.
                if (svg) {
                    iconSetConfig.svgElement = svg;
                }
            });
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].forkJoin(iconSetFetchRequests)
            .map(function (ignoredResults) {
            var foundIcon = _this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw new MdIconNameNotFoundError(name);
            }
            return foundIcon;
        });
    };
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MdIconRegistry.prototype._extractIconWithNameFromAnySet = function (iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (var i = iconSetConfigs.length - 1; i >= 0; i--) {
            var config = iconSetConfigs[i];
            if (config.svgElement) {
                var foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName, config);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    };
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MdIconRegistry.prototype._loadSvgIconFromConfig = function (config) {
        var _this = this;
        return this._fetchUrl(config.url)
            .map(function (svgText) { return _this._createSvgElementForSingleIcon(svgText, config); });
    };
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MdIconRegistry.prototype._loadSvgIconSetFromConfig = function (config) {
        var _this = this;
        // TODO: Document that icons should only be loaded from trusted sources.
        return this._fetchUrl(config.url)
            .map(function (svgText) { return _this._svgElementFromString(svgText); });
    };
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     */
    MdIconRegistry.prototype._createSvgElementForSingleIcon = function (responseText, config) {
        var svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg, config);
        return svg;
    };
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MdIconRegistry.prototype._extractSvgIconFromSet = function (iconSet, iconName, config) {
        var iconNode = iconSet.querySelector('#' + iconName);
        if (!iconNode) {
            return null;
        }
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconNode.tagName.toLowerCase() == 'svg') {
            return this._setSvgAttributes(iconNode.cloneNode(true), config);
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        var svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconNode.cloneNode(true));
        return this._setSvgAttributes(svg, config);
    };
    /**
     * Creates a DOM element from the given SVG string.
     */
    MdIconRegistry.prototype._svgElementFromString = function (str) {
        // TODO: Is there a better way than innerHTML? Renderer doesn't appear to have a method for
        // creating an element from an HTML string.
        var div = document.createElement('DIV');
        div.innerHTML = str;
        var svg = div.querySelector('svg');
        if (!svg) {
            throw new MdIconSvgTagNotFoundError();
        }
        return svg;
    };
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     */
    MdIconRegistry.prototype._setSvgAttributes = function (svg, config) {
        if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        return svg;
    };
    /**
     * Returns an Observable which produces the string contents of the given URL. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     */
    MdIconRegistry.prototype._fetchUrl = function (url) {
        var _this = this;
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        if (this._inProgressUrlFetches.has(url)) {
            return this._inProgressUrlFetches.get(url);
        }
        // TODO(jelbourn): for some reason, the `finally` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        var req = this._http.get(url)
            .map(function (response) { return response.text(); })
            .finally(function () {
            _this._inProgressUrlFetches.delete(url);
        })
            .share();
        this._inProgressUrlFetches.set(url, req);
        return req;
    };
    MdIconRegistry = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"]])
    ], MdIconRegistry);
    return MdIconRegistry;
}());
/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg) {
    return svg.cloneNode(true);
}

//# sourceMappingURL=icon-registry.js.map


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var AboutComponent = (function () {
    function AboutComponent() {
    }
    return AboutComponent;
}());
AboutComponent = __decorate([
    core_1.Component({
        selector: 'about',
        styles: [__webpack_require__(85)],
        template: __webpack_require__(73)
    })
], AboutComponent);
exports.AboutComponent = AboutComponent;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(33);
var ContactComponent = (function () {
    function ContactComponent(formBuilder) {
        this.formBuilder = formBuilder;
    }
    ContactComponent.prototype.ngOnInit = function () {
        //this.contactForm = this.formBuilder.group({
        //  name: ['', Validators.required],
        //  email: ['', [Validators.required, CustomValidators.validateEmail]],
        //  content: ['', [Validators.required, Validators.minLength(10)]]
        //});
    };
    ContactComponent.prototype.submitForm = function () {
        console.log(this.contactForm);
    };
    return ContactComponent;
}());
ContactComponent = __decorate([
    core_1.Component({
        selector: 'app-contact',
        template: __webpack_require__(75),
        styles: [__webpack_require__(86)]
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], ContactComponent);
exports.ContactComponent = ContactComponent;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(7);
var github_service_1 = __webpack_require__(5);
var RepoBrowserComponent = (function () {
    function RepoBrowserComponent(router, github) {
        this.router = router;
        this.github = github;
    }
    RepoBrowserComponent.prototype.searchForOrg = function (orgName) {
        var _this = this;
        this.github.getOrg(orgName)
            .subscribe(function (_a) {
            var name = _a.name;
            console.log(name);
            _this.router.navigate(['/github', orgName]);
        });
    };
    return RepoBrowserComponent;
}());
RepoBrowserComponent = __decorate([
    core_1.Component({
        selector: 'repo-browser',
        template: __webpack_require__(76),
        styles: [__webpack_require__(87)]
    }),
    __metadata("design:paramtypes", [router_1.Router, github_service_1.GithubService])
], RepoBrowserComponent);
exports.RepoBrowserComponent = RepoBrowserComponent;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(7);
var github_service_1 = __webpack_require__(5);
var RepoDetailComponent = (function () {
    function RepoDetailComponent(github, route) {
        this.github = github;
        this.route = route;
        this.repoDetails = {};
    }
    RepoDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.org = _this.route.snapshot.parent.params['org'];
            _this.repo = params['repo'] || '';
            if (_this.repo) {
                _this.github.getRepoForOrg(_this.org, _this.repo)
                    .subscribe(function (repoDetails) {
                    _this.repoDetails = repoDetails;
                });
            }
        });
    };
    return RepoDetailComponent;
}());
RepoDetailComponent = __decorate([
    core_1.Component({
        selector: 'repo-detail',
        styles: [__webpack_require__(88)],
        template: __webpack_require__(77)
    }),
    __metadata("design:paramtypes", [github_service_1.GithubService, router_1.ActivatedRoute])
], RepoDetailComponent);
exports.RepoDetailComponent = RepoDetailComponent;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var github_service_1 = __webpack_require__(5);
var router_1 = __webpack_require__(7);
var RepoListComponent = (function () {
    function RepoListComponent(github, route) {
        this.github = github;
        this.route = route;
    }
    RepoListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.org = params['org'];
            if (_this.org) {
                _this.repos = _this.github.getReposForOrg(_this.org);
            }
        });
    };
    return RepoListComponent;
}());
RepoListComponent = __decorate([
    core_1.Component({
        selector: 'repo-list',
        styles: [__webpack_require__(89)],
        template: __webpack_require__(78),
    }),
    __metadata("design:paramtypes", [github_service_1.GithubService, router_1.ActivatedRoute])
], RepoListComponent);
exports.RepoListComponent = RepoListComponent;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var HomeComponent = (function () {
    function HomeComponent() {
    }
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home',
        styles: [__webpack_require__(90)],
        template: __webpack_require__(79)
    })
], HomeComponent);
exports.HomeComponent = HomeComponent;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(13);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(28);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(39);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(83);
__webpack_require__(104);
__webpack_require__(68);
__webpack_require__(61);
var core_1 = __webpack_require__(0);
var platform_browser_dynamic_1 = __webpack_require__(102);
var app_module_1 = __webpack_require__(59);
if (true) {
    module['hot'].accept();
    module['hot'].dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    core_1.enableProdMode();
}
var modulePromise = platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(82);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(84);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(91);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(92);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=%2F__webpack_hmr", __webpack_require__(93)(module)))

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(280);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MdAnchor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MdButtonModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular2_material_core__ = __webpack_require__(2);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// TODO(jelbourn): Make the `isMouseDown` stuff done with one global listener.
// TODO(kara): Convert attribute selectors to classes when attr maps become available
var MdButton = (function () {
    function MdButton(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
        this._isKeyboardFocused = false;
        /** Whether a mousedown has occurred on this element in the last 100ms. */
        this._isMouseDown = false;
        /** Whether the ripple effect on click should be disabled. */
        this.disableRipple = false;
    }
    Object.defineProperty(MdButton.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdButton.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMouseDown = true;
        setTimeout(function () { _this._isMouseDown = false; }, 100);
    };
    MdButton.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdButton.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    MdButton.prototype._setKeyboardFocus = function () {
        this._isKeyboardFocused = !this._isMouseDown;
    };
    MdButton.prototype._removeKeyboardFocus = function () {
        this._isKeyboardFocused = false;
    };
    /** TODO(hansl): e2e test this function. */
    MdButton.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
    };
    MdButton.prototype.getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    MdButton.prototype.isRoundButton = function () {
        var el = this._elementRef.nativeElement;
        return el.hasAttribute('md-icon-button') ||
            el.hasAttribute('md-fab') ||
            el.hasAttribute('md-mini-fab');
    };
    MdButton.prototype.isRippleEnabled = function () {
        return !this.disableRipple;
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular2_material_core__["a" /* BooleanFieldValue */])(), 
        __metadata('design:type', Boolean)
    ], MdButton.prototype, "disableRipple", void 0);
    MdButton = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({selector: 'button[md-button], button[md-raised-button], button[md-icon-button], ' +
                'button[md-fab], button[md-mini-fab]',
            inputs: ['color'],
            host: {
                '[class.md-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
            },
            template: "<span class=\"md-button-wrapper\"><ng-content></ng-content></span> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /** * This mixin overrides default button styles like the gray background, * the border, and the outline. */ /** Applies a property to an md-button element for each of the supported palettes. */ /** Applies a focus style to an md-button element for each of the supported palettes. */ [md-raised-button], [md-fab], [md-mini-fab], [md-button], [md-icon-button] { box-sizing: border-box; position: relative; background: transparent; cursor: pointer; user-select: none; outline: none; border: none; display: inline-block; white-space: nowrap; text-decoration: none; vertical-align: baseline; font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; color: currentColor; text-align: center; margin: 0; min-width: 88px; line-height: 36px; padding: 0 16px; border-radius: 3px; } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab], .md-primary[md-button], .md-primary[md-icon-button] { color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab], .md-accent[md-button], .md-accent[md-icon-button] { color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab], .md-warn[md-button], .md-warn[md-icon-button] { color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-primary[disabled][md-button], .md-primary[disabled][md-icon-button], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-accent[disabled][md-button], .md-accent[disabled][md-icon-button], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], .md-warn[disabled][md-button], .md-warn[disabled][md-icon-button], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab], [disabled][disabled][md-button], [disabled][disabled][md-icon-button] { color: rgba(0, 0, 0, 0.38); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab], [disabled][md-button], [disabled][md-icon-button] { cursor: default; } .md-button-focus[md-raised-button]::after, .md-button-focus[md-fab]::after, .md-button-focus[md-mini-fab]::after, .md-button-focus[md-button]::after, .md-button-focus[md-icon-button]::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } .md-button-focus.md-primary[md-raised-button]::after, .md-button-focus.md-primary[md-fab]::after, .md-button-focus.md-primary[md-mini-fab]::after, .md-button-focus.md-primary[md-button]::after, .md-button-focus.md-primary[md-icon-button]::after { background-color: rgba(0, 150, 136, 0.12); } .md-button-focus.md-accent[md-raised-button]::after, .md-button-focus.md-accent[md-fab]::after, .md-button-focus.md-accent[md-mini-fab]::after, .md-button-focus.md-accent[md-button]::after, .md-button-focus.md-accent[md-icon-button]::after { background-color: rgba(156, 39, 176, 0.12); } .md-button-focus.md-warn[md-raised-button]::after, .md-button-focus.md-warn[md-fab]::after, .md-button-focus.md-warn[md-mini-fab]::after, .md-button-focus.md-warn[md-button]::after, .md-button-focus.md-warn[md-icon-button]::after { background-color: rgba(244, 67, 54, 0.12); } [md-raised-button], [md-fab], [md-mini-fab] { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); background-color: #fafafa; transform: translate3d(0, 0, 0); transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { color: white; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { color: rgba(255, 255, 255, 0.870588); } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { color: white; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { color: rgba(0, 0, 0, 0.38); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { background-color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { background-color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { background-color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { background-color: rgba(0, 0, 0, 0.12); } [md-raised-button]:active, [md-fab]:active, [md-mini-fab]:active { box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab] { box-shadow: none; } [md-button]:hover::after, [md-icon-button]:hover::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } [md-button]:hover.md-primary::after, [md-icon-button]:hover.md-primary::after { background-color: rgba(0, 150, 136, 0.12); } [md-button]:hover.md-accent::after, [md-icon-button]:hover.md-accent::after { background-color: rgba(156, 39, 176, 0.12); } [md-button]:hover.md-warn::after, [md-icon-button]:hover.md-warn::after { background-color: rgba(244, 67, 54, 0.12); } [md-button][disabled]:hover.md-primary, [md-button][disabled]:hover.md-accent, [md-button][disabled]:hover.md-warn, [md-button][disabled]:hover::after, [md-icon-button][disabled]:hover.md-primary, [md-icon-button][disabled]:hover.md-accent, [md-icon-button][disabled]:hover.md-warn, [md-icon-button][disabled]:hover::after { background-color: transparent; } [md-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 56px; height: 56px; padding: 0; } [md-fab] i, [md-fab] md-icon { padding: 16px 0; } [md-mini-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 40px; height: 40px; padding: 0; } [md-mini-fab] i, [md-mini-fab] md-icon { padding: 8px 0; } [md-icon-button] { min-width: 0; padding: 0; width: 40px; height: 40px; line-height: 24px; border-radius: 50%; } [md-icon-button] .md-button-wrapper > * { vertical-align: middle; } .md-button-ripple { position: absolute; top: 0; left: 0; bottom: 0; right: 0; } .md-button-ripple-round { border-radius: 50%; z-index: 1; } @media screen and (-ms-high-contrast: active) { .md-raised-button, .md-fab, .md-mini-fab { border: 1px solid #fff; } } /*# sourceMappingURL=button.css.map */ "],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]])
    ], MdButton);
    return MdButton;
}());
var MdAnchor = (function (_super) {
    __extends(MdAnchor, _super);
    function MdAnchor(elementRef, renderer) {
        _super.call(this, elementRef, renderer);
        this._disabled = null;
    }
    Object.defineProperty(MdAnchor.prototype, "tabIndex", {
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAnchor.prototype, "isAriaDisabled", {
        get: function () {
            return this.disabled ? 'true' : 'false';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAnchor.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value != false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    MdAnchor.prototype._haltDisabledEvents = function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('tabIndex'), 
        __metadata('design:type', Number)
    ], MdAnchor.prototype, "tabIndex", null);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('attr.aria-disabled'), 
        __metadata('design:type', String)
    ], MdAnchor.prototype, "isAriaDisabled", null);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('attr.disabled'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('disabled'), 
        __metadata('design:type', Object)
    ], MdAnchor.prototype, "disabled", null);
    MdAnchor = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({selector: 'a[md-button], a[md-raised-button], a[md-icon-button], a[md-fab], a[md-mini-fab]',
            inputs: ['color'],
            host: {
                '[class.md-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
                '(click)': '_haltDisabledEvents($event)',
            },
            template: "<span class=\"md-button-wrapper\"><ng-content></ng-content></span> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /** * This mixin overrides default button styles like the gray background, * the border, and the outline. */ /** Applies a property to an md-button element for each of the supported palettes. */ /** Applies a focus style to an md-button element for each of the supported palettes. */ [md-raised-button], [md-fab], [md-mini-fab], [md-button], [md-icon-button] { box-sizing: border-box; position: relative; background: transparent; cursor: pointer; user-select: none; outline: none; border: none; display: inline-block; white-space: nowrap; text-decoration: none; vertical-align: baseline; font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; color: currentColor; text-align: center; margin: 0; min-width: 88px; line-height: 36px; padding: 0 16px; border-radius: 3px; } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab], .md-primary[md-button], .md-primary[md-icon-button] { color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab], .md-accent[md-button], .md-accent[md-icon-button] { color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab], .md-warn[md-button], .md-warn[md-icon-button] { color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-primary[disabled][md-button], .md-primary[disabled][md-icon-button], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-accent[disabled][md-button], .md-accent[disabled][md-icon-button], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], .md-warn[disabled][md-button], .md-warn[disabled][md-icon-button], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab], [disabled][disabled][md-button], [disabled][disabled][md-icon-button] { color: rgba(0, 0, 0, 0.38); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab], [disabled][md-button], [disabled][md-icon-button] { cursor: default; } .md-button-focus[md-raised-button]::after, .md-button-focus[md-fab]::after, .md-button-focus[md-mini-fab]::after, .md-button-focus[md-button]::after, .md-button-focus[md-icon-button]::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } .md-button-focus.md-primary[md-raised-button]::after, .md-button-focus.md-primary[md-fab]::after, .md-button-focus.md-primary[md-mini-fab]::after, .md-button-focus.md-primary[md-button]::after, .md-button-focus.md-primary[md-icon-button]::after { background-color: rgba(0, 150, 136, 0.12); } .md-button-focus.md-accent[md-raised-button]::after, .md-button-focus.md-accent[md-fab]::after, .md-button-focus.md-accent[md-mini-fab]::after, .md-button-focus.md-accent[md-button]::after, .md-button-focus.md-accent[md-icon-button]::after { background-color: rgba(156, 39, 176, 0.12); } .md-button-focus.md-warn[md-raised-button]::after, .md-button-focus.md-warn[md-fab]::after, .md-button-focus.md-warn[md-mini-fab]::after, .md-button-focus.md-warn[md-button]::after, .md-button-focus.md-warn[md-icon-button]::after { background-color: rgba(244, 67, 54, 0.12); } [md-raised-button], [md-fab], [md-mini-fab] { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); background-color: #fafafa; transform: translate3d(0, 0, 0); transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { color: white; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { color: rgba(255, 255, 255, 0.870588); } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { color: white; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { color: rgba(0, 0, 0, 0.38); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { background-color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { background-color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { background-color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { background-color: rgba(0, 0, 0, 0.12); } [md-raised-button]:active, [md-fab]:active, [md-mini-fab]:active { box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab] { box-shadow: none; } [md-button]:hover::after, [md-icon-button]:hover::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } [md-button]:hover.md-primary::after, [md-icon-button]:hover.md-primary::after { background-color: rgba(0, 150, 136, 0.12); } [md-button]:hover.md-accent::after, [md-icon-button]:hover.md-accent::after { background-color: rgba(156, 39, 176, 0.12); } [md-button]:hover.md-warn::after, [md-icon-button]:hover.md-warn::after { background-color: rgba(244, 67, 54, 0.12); } [md-button][disabled]:hover.md-primary, [md-button][disabled]:hover.md-accent, [md-button][disabled]:hover.md-warn, [md-button][disabled]:hover::after, [md-icon-button][disabled]:hover.md-primary, [md-icon-button][disabled]:hover.md-accent, [md-icon-button][disabled]:hover.md-warn, [md-icon-button][disabled]:hover::after { background-color: transparent; } [md-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 56px; height: 56px; padding: 0; } [md-fab] i, [md-fab] md-icon { padding: 16px 0; } [md-mini-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 40px; height: 40px; padding: 0; } [md-mini-fab] i, [md-mini-fab] md-icon { padding: 8px 0; } [md-icon-button] { min-width: 0; padding: 0; width: 40px; height: 40px; line-height: 24px; border-radius: 50%; } [md-icon-button] .md-button-wrapper > * { vertical-align: middle; } .md-button-ripple { position: absolute; top: 0; left: 0; bottom: 0; right: 0; } .md-button-ripple-round { border-radius: 50%; z-index: 1; } @media screen and (-ms-high-contrast: active) { .md-raised-button, .md-fab, .md-mini-fab { border: 1px solid #fff; } } /*# sourceMappingURL=button.css.map */ "],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]])
    ], MdAnchor);
    return MdAnchor;
}(MdButton));
var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    MdButtonModule.forRoot = function () {
        return {
            ngModule: MdButtonModule,
            providers: []
        };
    };
    MdButtonModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"], __WEBPACK_IMPORTED_MODULE_2__angular2_material_core__["b" /* MdRippleModule */]],
            exports: [MdButton, MdAnchor],
            declarations: [MdButton, MdAnchor],
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonModule);
    return MdButtonModule;
}());

//# sourceMappingURL=button.js.map


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button__ = __webpack_require__(39);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdButton", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdAnchor", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdButtonModule", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["c"]; });


//# sourceMappingURL=index.js.map


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdCardContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MdCardTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MdCardSubtitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MdCardActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MdCard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return MdCardHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return MdCardTitleGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return MdCardModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Content of a card, needed as it's used as a selector in the API.
 */
var MdCardContent = (function () {
    function MdCardContent() {
    }
    MdCardContent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: 'md-card-content'
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardContent);
    return MdCardContent;
}());
/**
 * Title of a card, needed as it's used as a selector in the API.
 */
var MdCardTitle = (function () {
    function MdCardTitle() {
    }
    MdCardTitle = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: 'md-card-title'
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardTitle);
    return MdCardTitle;
}());
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 */
var MdCardSubtitle = (function () {
    function MdCardSubtitle() {
    }
    MdCardSubtitle = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: 'md-card-subtitle'
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardSubtitle);
    return MdCardSubtitle;
}());
/**
 * Action section of a card, needed as it's used as a selector in the API.
 */
var MdCardActions = (function () {
    function MdCardActions() {
    }
    MdCardActions = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: 'md-card-actions'
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardActions);
    return MdCardActions;
}());
/*

<md-card> is a basic content container component that adds the styles of a material design card.

While you can use this component alone,
it also provides a number of preset styles for common card sections, including:
 - md-card-title
 - md-card-subtitle
 - md-card-content
 - md-card-actions
 - md-card-footer

 You can see some examples of cards here:
 http://embed.plnkr.co/s5O4YcyvbLhIApSrIhtj/

 TODO(kara): update link to demo site when it exists

*/
var MdCard = (function () {
    function MdCard() {
    }
    MdCard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({selector: 'md-card',
            template: "<ng-content></ng-content> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ md-card { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); will-change: box-shadow; display: block; position: relative; padding: 24px; border-radius: 2px; font-family: Roboto, \"Helvetica Neue\", sans-serif; background: white; color: black; } md-card:hover { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); } .md-card-flat { box-shadow: none; } md-card-title, md-card-subtitle, md-card-content, md-card-actions { display: block; margin-bottom: 16px; } md-card-title { font-size: 24px; font-weight: 400; } md-card-subtitle { font-size: 14px; color: rgba(0, 0, 0, 0.54); } md-card-content { font-size: 14px; } md-card-actions { margin-left: -16px; margin-right: -16px; padding: 8px 0; } md-card-actions[align='end'] { display: flex; justify-content: flex-end; } [md-card-image] { width: calc(100% + 48px); margin: 0 -24px 16px -24px; } [md-card-xl-image] { width: 240px; height: 240px; margin: -8px; } md-card-footer { position: absolute; bottom: 0; } md-card-actions [md-button], md-card-actions [md-raised-button] { margin: 0 4px; } /* HEADER STYLES */ md-card-header { display: flex; flex-direction: row; height: 40px; margin: -8px 0 16px 0; } .md-card-header-text { height: 40px; margin: 0 8px; } [md-card-avatar] { height: 40px; width: 40px; border-radius: 50%; } md-card-header md-card-title { font-size: 14px; } /* TITLE-GROUP STYLES */ [md-card-sm-image], [md-card-md-image], [md-card-lg-image] { margin: -8px 0; } md-card-title-group { display: flex; justify-content: space-between; margin: 0 -8px; } [md-card-sm-image] { width: 80px; height: 80px; } [md-card-md-image] { width: 112px; height: 112px; } [md-card-lg-image] { width: 152px; height: 152px; } /* MEDIA QUERIES */ @media (max-width: 600px) { md-card { padding: 24px 16px; } [md-card-image] { width: calc(100% + 32px); margin: 16px -16px; } md-card-title-group { margin: 0; } [md-card-xl-image] { margin-left: 0; margin-right: 0; } md-card-header { margin: -8px 0 0 0; } } /* FIRST/LAST CHILD ADJUSTMENTS */ md-card > :first-child, md-card-content > :first-child { margin-top: 0; } md-card > :last-child, md-card-content > :last-child { margin-bottom: 0; } [md-card-image]:first-child { margin-top: -24px; } md-card > md-card-actions:last-child { margin-bottom: -16px; padding-bottom: 0; } md-card-actions [md-button]:first-child, md-card-actions [md-raised-button]:first-child { margin-left: 0; margin-right: 0; } md-card-title:not(:first-child), md-card-subtitle:not(:first-child) { margin-top: -4px; } md-card-header md-card-subtitle:not(:first-child) { margin-top: -8px; } md-card > [md-card-xl-image]:first-child { margin-top: -8px; } md-card > [md-card-xl-image]:last-child { margin-bottom: -8px; } /*# sourceMappingURL=card.css.map */ "],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCard);
    return MdCard;
}());
/*  The following components don't have any behavior.
 They simply use content projection to wrap user content
 for flex layout purposes in <md-card> (and thus allow a cleaner, boilerplate-free API).


<md-card-header> is a component intended to be used within the <md-card> component.
It adds styles for a preset header section (i.e. a title, subtitle, and avatar layout).

You can see an example of a card with a header here:
http://embed.plnkr.co/tvJl19z3gZTQd6WmwkIa/

TODO(kara): update link to demo site when it exists
*/
var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    MdCardHeader = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({selector: 'md-card-header',
            template: "<ng-content select=\"[md-card-avatar]\"></ng-content> <div class=\"md-card-header-text\"> <ng-content select=\"md-card-title, md-card-subtitle\"></ng-content> </div> <ng-content></ng-content> ",
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardHeader);
    return MdCardHeader;
}());
/*

<md-card-title-group> is a component intended to be used within the <md-card> component.
It adds styles for a preset layout that groups an image with a title section.

You can see an example of a card with a title-group section here:
http://embed.plnkr.co/EDfgCF9eKcXjini1WODm/

TODO(kara): update link to demo site when it exists
*/
var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    MdCardTitleGroup = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({selector: 'md-card-title-group',
            template: "<div> <ng-content select=\"md-card-title, md-card-subtitle\"></ng-content> </div> <ng-content select=\"img\"></ng-content> <ng-content></ng-content> ",
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardTitleGroup);
    return MdCardTitleGroup;
}());
var MdCardModule = (function () {
    function MdCardModule() {
    }
    MdCardModule.forRoot = function () {
        return {
            ngModule: MdCardModule,
            providers: []
        };
    };
    MdCardModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [
                MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                MdCardActions
            ],
            declarations: [
                MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                MdCardActions
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardModule);
    return MdCardModule;
}());

//# sourceMappingURL=card.js.map


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card__ = __webpack_require__(41);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardContent", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardTitle", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardSubtitle", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardActions", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCard", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardHeader", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardTitleGroup", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdCardModule", function() { return __WEBPACK_IMPORTED_MODULE_0__card__["h"]; });


//# sourceMappingURL=index.js.map


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return booleanFieldValueFactory; });
/**
 * Annotation Factory that allows HTML style boolean attributes. For example,
 * a field declared like this:

 * @Directive({ selector: 'component' }) class MyComponent {
 *   @Input() @BooleanFieldValueFactory() myField: boolean;
 * }
 *
 * You could set it up this way:
 *   <component myField>
 * or:
 *   <component myField="">
 * @deprecated
 */
function booleanFieldValueFactory() {
    return function booleanFieldValueMetadata(target, key) {
        var defaultValue = target[key];
        var localKey = "__md_private_symbol_" + key;
        target[localKey] = defaultValue;
        Object.defineProperty(target, key, {
            get: function () { return this[localKey]; },
            set: function (value) {
                this[localKey] = value != null && "" + value !== 'false';
            }
        });
    };
}


//# sourceMappingURL=field-value.js.map


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MdUniqueSelectionDispatcher */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
var MdUniqueSelectionDispatcher = (function () {
    function MdUniqueSelectionDispatcher() {
        this._listeners = [];
    }
    /** Notify other items that selection for the given name has been set. */
    MdUniqueSelectionDispatcher.prototype.notify = function (id, name) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(id, name);
        }
    };
    /** Listen for future changes to item selection. */
    MdUniqueSelectionDispatcher.prototype.listen = function (listener) {
        this._listeners.push(listener);
    };
    MdUniqueSelectionDispatcher = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [])
    ], MdUniqueSelectionDispatcher);
    return MdUniqueSelectionDispatcher;
}());

//# sourceMappingURL=unique-selection-dispatcher.js.map


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MdCoreModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__line_line__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rtl_dir__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ripple_ripple__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__portal_portal_directives__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__overlay_overlay_directives__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__a11y_live_announcer__ = __webpack_require__(12);
/* unused harmony reexport Dir */
/* unused harmony reexport RtlModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__portal_portal__ = __webpack_require__(4);
/* unused harmony reexport Portal */
/* unused harmony reexport BasePortalHost */
/* unused harmony reexport ComponentPortal */
/* unused harmony reexport TemplatePortal */
/* unused harmony reexport PortalHostDirective */
/* unused harmony reexport TemplatePortalDirective */
/* unused harmony reexport PortalModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__portal_dom_portal_host__ = __webpack_require__(21);
/* unused harmony reexport DomPortalHost */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__overlay_overlay__ = __webpack_require__(18);
/* unused harmony reexport Overlay */
/* unused harmony reexport OVERLAY_PROVIDERS */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__overlay_overlay_container__ = __webpack_require__(15);
/* unused harmony reexport OverlayContainer */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__overlay_overlay_ref__ = __webpack_require__(17);
/* unused harmony reexport OverlayRef */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__overlay_overlay_state__ = __webpack_require__(8);
/* unused harmony reexport OverlayState */
/* unused harmony reexport ConnectedOverlayDirective */
/* unused harmony reexport OverlayOrigin */
/* unused harmony reexport OverlayModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__overlay_position_connected_position_strategy__ = __webpack_require__(19);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__overlay_position_connected_position__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__gestures_MdGestureConfig__ = __webpack_require__(46);
/* unused harmony reexport MdGestureConfig */
/* unused harmony reexport MdRipple */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3__ripple_ripple__["a"]; });
/* unused harmony reexport MdLiveAnnouncer */
/* unused harmony reexport LIVE_ANNOUNCER_ELEMENT_TOKEN */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__coordination_unique_selection_dispatcher__ = __webpack_require__(44);
/* unused harmony reexport MdUniqueSelectionDispatcher */
/* unused harmony reexport MdLineModule */
/* unused harmony reexport MdLine */
/* unused harmony reexport MdLineSetter */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__style_apply_transform__ = __webpack_require__(51);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_17__style_apply_transform__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__errors_error__ = __webpack_require__(13);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_18__errors_error__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__annotations_field_value__ = __webpack_require__(43);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_19__annotations_field_value__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__keyboard_keycodes__ = __webpack_require__(47);
/* unused harmony namespace reexport */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







// RTL

// Portals



// Overlay







// Gestures

// Ripple

// a11y



// Style

// Error

// Annotations.

// Misc
// Keybindings

var MdCoreModule = (function () {
    function MdCoreModule() {
    }
    MdCoreModule.forRoot = function () {
        return {
            ngModule: MdCoreModule,
            providers: [__WEBPACK_IMPORTED_MODULE_6__a11y_live_announcer__["a" /* MdLiveAnnouncer */]]
        };
    };
    MdCoreModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__line_line__["a" /* MdLineModule */], __WEBPACK_IMPORTED_MODULE_2__rtl_dir__["a" /* RtlModule */], __WEBPACK_IMPORTED_MODULE_3__ripple_ripple__["a" /* MdRippleModule */], __WEBPACK_IMPORTED_MODULE_4__portal_portal_directives__["a" /* PortalModule */], __WEBPACK_IMPORTED_MODULE_5__overlay_overlay_directives__["a" /* OverlayModule */]],
            exports: [__WEBPACK_IMPORTED_MODULE_1__line_line__["a" /* MdLineModule */], __WEBPACK_IMPORTED_MODULE_2__rtl_dir__["a" /* RtlModule */], __WEBPACK_IMPORTED_MODULE_3__ripple_ripple__["a" /* MdRippleModule */], __WEBPACK_IMPORTED_MODULE_4__portal_portal_directives__["a" /* PortalModule */], __WEBPACK_IMPORTED_MODULE_5__overlay_overlay_directives__["a" /* OverlayModule */]],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCoreModule);
    return MdCoreModule;
}());

//# sourceMappingURL=core.js.map


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MdGestureConfig */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(34);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/* Adjusts configuration of our gesture library, Hammer. */
var MdGestureConfig = (function (_super) {
    __extends(MdGestureConfig, _super);
    function MdGestureConfig() {
        _super.apply(this, arguments);
        /* List of new event names to add to the gesture support list */
        this.events = [
            'drag',
            'dragstart',
            'dragend',
            'dragright',
            'dragleft',
            'longpress',
            'slide',
            'slidestart',
            'slideend',
            'slideright',
            'slideleft'
        ];
    }
    /*
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * TODO: Confirm threshold numbers with Material Design UX Team
     * */
    MdGestureConfig.prototype.buildHammer = function (element) {
        var mc = new Hammer(element);
        // Default Hammer Recognizers.
        var pan = new Hammer.Pan();
        var swipe = new Hammer.Swipe();
        var press = new Hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        var slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        var drag = this._createRecognizer(slide, { event: 'drag', threshold: 6 }, swipe);
        var longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
        // Overwrite the default `pan` event to use the swipe event.
        pan.recognizeWith(swipe);
        // Add customized gestures to Hammer manager
        mc.add([swipe, press, pan, drag, slide, longpress]);
        return mc;
    };
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    MdGestureConfig.prototype._createRecognizer = function (base, options) {
        var inheritances = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            inheritances[_i - 2] = arguments[_i];
        }
        var recognizer = new base.constructor(options);
        inheritances.push(base);
        inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
        return recognizer;
    };
    MdGestureConfig = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [])
    ], MdGestureConfig);
    return MdGestureConfig;
}(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["HammerGestureConfig"]));

//# sourceMappingURL=MdGestureConfig.js.map


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export UP_ARROW */
/* unused harmony export DOWN_ARROW */
/* unused harmony export RIGHT_ARROW */
/* unused harmony export LEFT_ARROW */
/* unused harmony export ENTER */
/* unused harmony export TAB */
// Due to a bug in the ChromeDriver, Angular 2 keyboard events are not triggered by `sendKeys`
// during E2E tests when using dot notation such as `(keydown.rightArrow)`. To get around this,
// we are temporarily using a single (keydown) handler.
// See: https://github.com/angular/angular/issues/9419
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var ENTER = 13;
var TAB = 9;

//# sourceMappingURL=keycodes.js.map


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalPositionStrategy; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular2_material_core__ = __webpack_require__(2);

/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport.
 */
var GlobalPositionStrategy = (function () {
    function GlobalPositionStrategy() {
        this._cssPosition = 'absolute';
        this._top = '';
        this._bottom = '';
        this._left = '';
        this._right = '';
        /** Array of individual applications of translateX(). Currently only for centering. */
        this._translateX = [];
        /** Array of individual applications of translateY(). Currently only for centering. */
        this._translateY = [];
    }
    /** Sets the element to usee CSS position: fixed */
    GlobalPositionStrategy.prototype.fixed = function () {
        this._cssPosition = 'fixed';
        return this;
    };
    /** Sets the element to usee CSS position: absolute. This is the default. */
    GlobalPositionStrategy.prototype.absolute = function () {
        this._cssPosition = 'absolute';
        return this;
    };
    /** Sets the top position of the overlay. Clears any previously set vertical position. */
    GlobalPositionStrategy.prototype.top = function (value) {
        this._bottom = '';
        this._translateY = [];
        this._top = value;
        return this;
    };
    /** Sets the left position of the overlay. Clears any previously set horizontal position. */
    GlobalPositionStrategy.prototype.left = function (value) {
        this._right = '';
        this._translateX = [];
        this._left = value;
        return this;
    };
    /** Sets the bottom position of the overlay. Clears any previously set vertical position. */
    GlobalPositionStrategy.prototype.bottom = function (value) {
        this._top = '';
        this._translateY = [];
        this._bottom = value;
        return this;
    };
    /** Sets the right position of the overlay. Clears any previously set horizontal position. */
    GlobalPositionStrategy.prototype.right = function (value) {
        this._left = '';
        this._translateX = [];
        this._right = value;
        return this;
    };
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     */
    GlobalPositionStrategy.prototype.centerHorizontally = function (offset) {
        if (offset === void 0) { offset = '0px'; }
        this._left = '50%';
        this._right = '';
        this._translateX = ['-50%', offset];
        return this;
    };
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     */
    GlobalPositionStrategy.prototype.centerVertically = function (offset) {
        if (offset === void 0) { offset = '0px'; }
        this._top = '50%';
        this._bottom = '';
        this._translateY = ['-50%', offset];
        return this;
    };
    /**
     * Apply the position to the element.
     * TODO: internal
     */
    GlobalPositionStrategy.prototype.apply = function (element) {
        element.style.position = this._cssPosition;
        element.style.top = this._top;
        element.style.left = this._left;
        element.style.bottom = this._bottom;
        element.style.right = this._right;
        // TODO(jelbourn): we don't want to always overwrite the transform property here,
        // because it will need to be used for animations.
        var tranlateX = this._reduceTranslateValues('translateX', this._translateX);
        var translateY = this._reduceTranslateValues('translateY', this._translateY);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular2_material_core__["c" /* applyCssTransform */])(element, tranlateX + " " + translateY);
        return Promise.resolve(null);
    };
    /** Reduce a list of translate values to a string that can be used in the transform property */
    GlobalPositionStrategy.prototype._reduceTranslateValues = function (translateFn, values) {
        return values.map(function (t) { return (translateFn + "(" + t + ")"); }).join(' ');
    };
    return GlobalPositionStrategy;
}());

//# sourceMappingURL=global-position-strategy.js.map


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OverlayPositionBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__viewport_ruler__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connected_position_strategy__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_position_strategy__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/** Builder for overlay position strategy. */
var OverlayPositionBuilder = (function () {
    function OverlayPositionBuilder(_viewportRuler) {
        this._viewportRuler = _viewportRuler;
    }
    /** Creates a global position strategy. */
    OverlayPositionBuilder.prototype.global = function () {
        return new __WEBPACK_IMPORTED_MODULE_3__global_position_strategy__["a" /* GlobalPositionStrategy */]();
    };
    /** Creates a relative position strategy. */
    OverlayPositionBuilder.prototype.connectedTo = function (elementRef, originPos, overlayPos) {
        return new __WEBPACK_IMPORTED_MODULE_1__connected_position_strategy__["a" /* ConnectedPositionStrategy */](elementRef, originPos, overlayPos, this._viewportRuler);
    };
    OverlayPositionBuilder = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__viewport_ruler__["a" /* ViewportRuler */]])
    ], OverlayPositionBuilder);
    return OverlayPositionBuilder;
}());

//# sourceMappingURL=overlay-position-builder.js.map


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ForegroundRippleState; });
/* unused harmony export ForegroundRipple */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RippleRenderer; });
/** TODO: internal */
var ForegroundRippleState;
(function (ForegroundRippleState) {
    ForegroundRippleState[ForegroundRippleState["NEW"] = 0] = "NEW";
    ForegroundRippleState[ForegroundRippleState["EXPANDING"] = 1] = "EXPANDING";
    ForegroundRippleState[ForegroundRippleState["FADING_OUT"] = 2] = "FADING_OUT";
})(ForegroundRippleState || (ForegroundRippleState = {}));
/**
 * Wrapper for a foreground ripple DOM element and its animation state.
 * TODO: internal
 */
var ForegroundRipple = (function () {
    function ForegroundRipple(rippleElement) {
        this.rippleElement = rippleElement;
        this.state = ForegroundRippleState.NEW;
    }
    return ForegroundRipple;
}());
var RIPPLE_SPEED_PX_PER_SECOND = 1000;
var MIN_RIPPLE_FILL_TIME_SECONDS = 0.1;
var MAX_RIPPLE_FILL_TIME_SECONDS = 0.3;
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
var distanceToFurthestCorner = function (x, y, rect) {
    var distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    var distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
};
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * TODO: internal
 */
var RippleRenderer = (function () {
    function RippleRenderer(_elementRef, _eventHandlers) {
        this._eventHandlers = _eventHandlers;
        this._rippleElement = _elementRef.nativeElement;
        // It might be nice to delay creating the background until it's needed, but doing this in
        // fadeInRippleBackground causes the first click event to not be handled reliably.
        this._backgroundDiv = document.createElement('div');
        this._backgroundDiv.classList.add('md-ripple-background');
        this._rippleElement.appendChild(this._backgroundDiv);
    }
    /**
     * Installs event handlers on the given trigger element, and removes event handlers from the
     * previous trigger if needed.
     */
    RippleRenderer.prototype.setTriggerElement = function (newTrigger) {
        var _this = this;
        if (this._triggerElement !== newTrigger) {
            if (this._triggerElement) {
                this._eventHandlers.forEach(function (eventHandler, eventName) {
                    _this._triggerElement.removeEventListener(eventName, eventHandler);
                });
            }
            this._triggerElement = newTrigger;
            if (this._triggerElement) {
                this._eventHandlers.forEach(function (eventHandler, eventName) {
                    _this._triggerElement.addEventListener(eventName, eventHandler);
                });
            }
        }
    };
    /**
     * Installs event handlers on the host element of the md-ripple directive.
     */
    RippleRenderer.prototype.setTriggerElementToHost = function () {
        this.setTriggerElement(this._rippleElement);
    };
    /**
     * Removes event handlers from the current trigger element if needed.
     */
    RippleRenderer.prototype.clearTriggerElement = function () {
        this.setTriggerElement(null);
    };
    /**
     * Creates a foreground ripple and sets its animation to expand and fade in from the position
     * given by rippleOriginLeft and rippleOriginTop (or from the center of the <md-ripple>
     * bounding rect if centered is true).
     */
    RippleRenderer.prototype.createForegroundRipple = function (rippleOriginLeft, rippleOriginTop, color, centered, radius, speedFactor, transitionEndCallback) {
        var parentRect = this._rippleElement.getBoundingClientRect();
        // Create a foreground ripple div with the size and position of the fully expanded ripple.
        // When the div is created, it's given a transform style that causes the ripple to be displayed
        // small and centered on the event location (or the center of the bounding rect if the centered
        // argument is true). Removing that transform causes the ripple to animate to its natural size.
        var startX = centered ? (parentRect.left + parentRect.width / 2) : rippleOriginLeft;
        var startY = centered ? (parentRect.top + parentRect.height / 2) : rippleOriginTop;
        var offsetX = startX - parentRect.left;
        var offsetY = startY - parentRect.top;
        var maxRadius = radius > 0 ? radius : distanceToFurthestCorner(startX, startY, parentRect);
        var rippleDiv = document.createElement('div');
        this._rippleElement.appendChild(rippleDiv);
        rippleDiv.classList.add('md-ripple-foreground');
        rippleDiv.style.left = (offsetX - maxRadius) + "px";
        rippleDiv.style.top = (offsetY - maxRadius) + "px";
        rippleDiv.style.width = 2 * maxRadius + "px";
        rippleDiv.style.height = rippleDiv.style.width;
        // If color input is not set, this will default to the background color defined in CSS.
        rippleDiv.style.backgroundColor = color;
        // Start the ripple tiny.
        rippleDiv.style.transform = "scale(0.001)";
        var fadeInSeconds = (1 / (speedFactor || 1)) * Math.max(MIN_RIPPLE_FILL_TIME_SECONDS, Math.min(MAX_RIPPLE_FILL_TIME_SECONDS, maxRadius / RIPPLE_SPEED_PX_PER_SECOND));
        rippleDiv.style.transitionDuration = fadeInSeconds + "s";
        // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
        window.getComputedStyle(rippleDiv).opacity;
        rippleDiv.classList.add('md-ripple-fade-in');
        // Clearing the transform property causes the ripple to animate to its full size.
        rippleDiv.style.transform = '';
        var ripple = new ForegroundRipple(rippleDiv);
        ripple.state = ForegroundRippleState.EXPANDING;
        rippleDiv.addEventListener('transitionend', function (event) { return transitionEndCallback(ripple, event); });
    };
    /**
     * Fades out a foreground ripple after it has fully expanded and faded in.
     */
    RippleRenderer.prototype.fadeOutForegroundRipple = function (ripple) {
        ripple.classList.remove('md-ripple-fade-in');
        ripple.classList.add('md-ripple-fade-out');
    };
    /**
     * Removes a foreground ripple from the DOM after it has faded out.
     */
    RippleRenderer.prototype.removeRippleFromDom = function (ripple) {
        ripple.parentElement.removeChild(ripple);
    };
    /**
     * Fades in the ripple background.
     */
    RippleRenderer.prototype.fadeInRippleBackground = function (color) {
        this._backgroundDiv.classList.add('md-ripple-active');
        // If color is not set, this will default to the background color defined in CSS.
        this._backgroundDiv.style.backgroundColor = color;
    };
    /**
     * Fades out the ripple background.
     */
    RippleRenderer.prototype.fadeOutRippleBackground = function () {
        if (this._backgroundDiv) {
            this._backgroundDiv.classList.remove('md-ripple-active');
        }
    };
    return RippleRenderer;
}());

//# sourceMappingURL=ripple-renderer.js.map


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyCssTransform;
/**
 * Applies a CSS transform to an element, including browser-prefixed properties.
 * @param element
 * @param transformValue
 */
function applyCssTransform(element, transformValue) {
    // It's important to trim the result, because the browser will ignore the set operation
    // if the string contains only whitespace.
    var value = transformValue.trim();
    element.style.transform = value;
    element.style.webkitTransform = value;
}

//# sourceMappingURL=apply-transform.js.map


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MdIconInvalidNameError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MdIcon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MdIconModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular2_material_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__icon_registry__ = __webpack_require__(25);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_3__icon_registry__["a"]; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/** Exception thrown when an invalid icon name is passed to an md-icon component. */
var MdIconInvalidNameError = (function (_super) {
    __extends(MdIconInvalidNameError, _super);
    function MdIconInvalidNameError(iconName) {
        _super.call(this, "Invalid icon name: \"" + iconName + "\"");
    }
    return MdIconInvalidNameError;
}(__WEBPACK_IMPORTED_MODULE_2__angular2_material_core__["d" /* MdError */]));
/**
 * Component to display an icon. It can be used in the following ways:
 * - Specify the svgSrc input to load an SVG icon from a URL. The SVG content is directly inlined
 *   as a child of the <md-icon> component, so that CSS styles can easily be applied to it.
 *   The URL is loaded via an XMLHttpRequest, so it must be on the same domain as the page or its
 *   server must be configured to allow cross-domain requests.
 *   Example:
 *     <md-icon svgSrc="assets/arrow.svg"></md-icon>
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MdIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     <md-icon svgIcon="left-arrow"></md-icon>
 *     <md-icon svgIcon="animals:cat"></md-icon>
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the <md-icon>
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MdIconRegistry.registerFontClassAlias.
 *   Examples:
 *     <md-icon>home</md-icon>
 *     <md-icon fontSet="myfont">sun</md-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     <md-icon fontSet="fa" fontIcon="alarm"></md-icon>
 */
var MdIcon = (function () {
    function MdIcon(_element, _renderer, _mdIconRegistry) {
        this._element = _element;
        this._renderer = _renderer;
        this._mdIconRegistry = _mdIconRegistry;
        this.hostAriaLabel = '';
    }
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws a MdIconInvalidNameError if the name contains two or more ':' separators.
     * Examples:
     *   'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws MdIconInvalidNameError)
     */
    MdIcon.prototype._splitIconName = function (iconName) {
        if (!iconName) {
            return ['', ''];
        }
        var parts = iconName.split(':');
        switch (parts.length) {
            case 1:
                // Use default namespace.
                return ['', parts[0]];
            case 2:
                return parts;
            default:
                throw new MdIconInvalidNameError(iconName);
        }
    };
    /** TODO: internal */
    MdIcon.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var changedInputs = Object.keys(changes);
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        if (changedInputs.indexOf('svgIcon') != -1 || changedInputs.indexOf('svgSrc') != -1) {
            if (this.svgIcon) {
                var _a = this._splitIconName(this.svgIcon), namespace = _a[0], iconName = _a[1];
                this._mdIconRegistry.getNamedSvgIcon(iconName, namespace).subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err); });
            }
            else if (this.svgSrc) {
                this._mdIconRegistry.getSvgIconFromUrl(this.svgSrc).subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err); });
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
        this._updateAriaLabel();
    };
    /** TODO: internal */
    MdIcon.prototype.ngOnInit = function () {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <md-icon>arrow</md-icon>. In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    /** TODO: internal */
    MdIcon.prototype.ngAfterViewChecked = function () {
        // Update aria label here because it may depend on the projected text content.
        // (e.g. <md-icon>home</md-icon> should use 'home').
        this._updateAriaLabel();
    };
    MdIcon.prototype._updateAriaLabel = function () {
        var ariaLabel = this._getAriaLabel();
        if (ariaLabel) {
            this._renderer.setElementAttribute(this._element.nativeElement, 'aria-label', ariaLabel);
        }
    };
    MdIcon.prototype._getAriaLabel = function () {
        // If the parent provided an aria-label attribute value, use it as-is. Otherwise look for a
        // reasonable value from the alt attribute, font icon name, SVG icon name, or (for ligatures)
        // the text content of the directive.
        var label = this.hostAriaLabel ||
            this.alt ||
            this.fontIcon ||
            this._splitIconName(this.svgIcon)[1];
        if (label) {
            return label;
        }
        // The "content" of an SVG icon is not a useful label.
        if (this._usingFontIcon()) {
            var text = this._element.nativeElement.textContent;
            if (text) {
                return text;
            }
        }
        // TODO: Warn here in dev mode.
        return null;
    };
    MdIcon.prototype._usingFontIcon = function () {
        return !(this.svgIcon || this.svgSrc);
    };
    MdIcon.prototype._setSvgElement = function (svg) {
        var layoutElement = this._element.nativeElement;
        // Remove existing child nodes and add the new SVG element.
        // We would use renderer.detachView(Array.from(layoutElement.childNodes)) here,
        // but it fails in IE11: https://github.com/angular/angular/issues/6327
        layoutElement.innerHTML = '';
        this._renderer.projectNodes(layoutElement, [svg]);
    };
    MdIcon.prototype._updateFontIconClasses = function () {
        if (!this._usingFontIcon()) {
            return;
        }
        var elem = this._element.nativeElement;
        var fontSetClass = this.fontSet ?
            this._mdIconRegistry.classNameForFontAlias(this.fontSet) :
            this._mdIconRegistry.getDefaultFontSetClass();
        if (fontSetClass != this._previousFontSetClass) {
            if (this._previousFontSetClass) {
                this._renderer.setElementClass(elem, this._previousFontSetClass, false);
            }
            if (fontSetClass) {
                this._renderer.setElementClass(elem, fontSetClass, true);
            }
            this._previousFontSetClass = fontSetClass;
        }
        if (this.fontIcon != this._previousFontIconClass) {
            if (this._previousFontIconClass) {
                this._renderer.setElementClass(elem, this._previousFontIconClass, false);
            }
            if (this.fontIcon) {
                this._renderer.setElementClass(elem, this.fontIcon, true);
            }
            this._previousFontIconClass = this.fontIcon;
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "svgSrc", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "svgIcon", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "fontSet", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "fontIcon", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "alt", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('aria-label'), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "hostAriaLabel", void 0);
    MdIcon = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template: '<ng-content></ng-content>',
            selector: 'md-icon',
            styles: ["/** The width/height of the icon element. */ /** This works because we're using ViewEncapsulation.None. If we used the default encapsulation, the selector would need to be \":host\". */ md-icon { background-repeat: no-repeat; display: inline-block; fill: currentColor; height: 24px; width: 24px; } /*# sourceMappingURL=icon.css.map */ "],
            host: {
                'role': 'img',
            },
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], __WEBPACK_IMPORTED_MODULE_3__icon_registry__["a" /* MdIconRegistry */]])
    ], MdIcon);
    return MdIcon;
}());
var MdIconModule = (function () {
    function MdIconModule() {
    }
    MdIconModule.forRoot = function () {
        return {
            ngModule: MdIconModule,
            providers: [__WEBPACK_IMPORTED_MODULE_3__icon_registry__["a" /* MdIconRegistry */]],
        };
    };
    MdIconModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_http__["HttpModule"]],
            exports: [MdIcon],
            declarations: [MdIcon],
        }), 
        __metadata('design:paramtypes', [])
    ], MdIconModule);
    return MdIconModule;
}());

//# sourceMappingURL=icon.js.map


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__icon__ = __webpack_require__(52);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdIconRegistry", function() { return __WEBPACK_IMPORTED_MODULE_0__icon__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdIconInvalidNameError", function() { return __WEBPACK_IMPORTED_MODULE_0__icon__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdIcon", function() { return __WEBPACK_IMPORTED_MODULE_0__icon__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdIconModule", function() { return __WEBPACK_IMPORTED_MODULE_0__icon__["d"]; });


//# sourceMappingURL=index.js.map


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__toolbar__ = __webpack_require__(55);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdToolbarRow", function() { return __WEBPACK_IMPORTED_MODULE_0__toolbar__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdToolbar", function() { return __WEBPACK_IMPORTED_MODULE_0__toolbar__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MdToolbarModule", function() { return __WEBPACK_IMPORTED_MODULE_0__toolbar__["c"]; });


//# sourceMappingURL=index.js.map


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdToolbarRow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MdToolbar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MdToolbarModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MdToolbarRow = (function () {
    function MdToolbarRow() {
    }
    MdToolbarRow = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: 'md-toolbar-row'
        }), 
        __metadata('design:paramtypes', [])
    ], MdToolbarRow);
    return MdToolbarRow;
}());
var MdToolbar = (function () {
    function MdToolbar(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    Object.defineProperty(MdToolbar.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdToolbar.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdToolbar.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this.renderer.setElementClass(this.elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(), 
        __metadata('design:type', String)
    ], MdToolbar.prototype, "color", null);
    MdToolbar = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({selector: 'md-toolbar',
            template: "<div class=\"md-toolbar-layout\"> <md-toolbar-row> <ng-content></ng-content> </md-toolbar-row> <ng-content select=\"md-toolbar-row\"></ng-content> </div>",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ md-toolbar { display: flex; box-sizing: border-box; width: 100%; min-height: 64px; font-size: 20px; font-weight: 400; font-family: Roboto, \"Helvetica Neue\", sans-serif; padding: 0 16px; flex-direction: column; background: whitesmoke; color: rgba(0, 0, 0, 0.87); } md-toolbar.md-primary { background: #009688; color: white; } md-toolbar.md-accent { background: #9c27b0; color: rgba(255, 255, 255, 0.870588); } md-toolbar.md-warn { background: #f44336; color: white; } md-toolbar md-toolbar-row { display: flex; box-sizing: border-box; width: 100%; height: 64px; flex-direction: row; align-items: center; } /*# sourceMappingURL=toolbar.css.map */ "],
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]])
    ], MdToolbar);
    return MdToolbar;
}());
var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    MdToolbarModule.forRoot = function () {
        return {
            ngModule: MdToolbarModule,
            providers: []
        };
    };
    MdToolbarModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [MdToolbar, MdToolbarRow],
            declarations: [MdToolbar, MdToolbarRow],
        }), 
        __metadata('design:paramtypes', [])
    ], MdToolbarModule);
    return MdToolbarModule;
}());

//# sourceMappingURL=toolbar.js.map


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: __webpack_require__(74),
    })
], AppComponent);
exports.AppComponent = AppComponent;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(7);
var app_routes_1 = __webpack_require__(60);
var app_component_1 = __webpack_require__(58);
var github_service_1 = __webpack_require__(5);
var forms_1 = __webpack_require__(33);
var platform_browser_1 = __webpack_require__(34);
var http_1 = __webpack_require__(6);
var card_1 = __webpack_require__(42);
var icon_1 = __webpack_require__(53);
var button_1 = __webpack_require__(40);
var toolbar_1 = __webpack_require__(54);
var about_component_1 = __webpack_require__(26);
var home_component_1 = __webpack_require__(31);
var repo_browser_component_1 = __webpack_require__(28);
var repo_list_component_1 = __webpack_require__(30);
var repo_detail_component_1 = __webpack_require__(29);
var contact_component_1 = __webpack_require__(27);
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            about_component_1.AboutComponent,
            repo_browser_component_1.RepoBrowserComponent,
            repo_list_component_1.RepoListComponent,
            repo_detail_component_1.RepoDetailComponent,
            home_component_1.HomeComponent,
            contact_component_1.ContactComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule, platform_browser_1.BrowserModule, card_1.MdCardModule, button_1.MdButtonModule, icon_1.MdIconModule, toolbar_1.MdToolbarModule,
            router_1.RouterModule.forRoot(app_routes_1.rootRouterConfig, { useHash: true })
        ],
        providers: [
            github_service_1.GithubService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var about_component_1 = __webpack_require__(26);
var home_component_1 = __webpack_require__(31);
var repo_browser_component_1 = __webpack_require__(28);
var repo_list_component_1 = __webpack_require__(30);
var repo_detail_component_1 = __webpack_require__(29);
var contact_component_1 = __webpack_require__(27);
exports.rootRouterConfig = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'about', component: about_component_1.AboutComponent },
    { path: 'github', component: repo_browser_component_1.RepoBrowserComponent,
        children: [
            { path: '', component: repo_list_component_1.RepoListComponent },
            { path: ':org', component: repo_list_component_1.RepoListComponent,
                children: [
                    { path: '', component: repo_detail_component_1.RepoDetailComponent },
                    { path: ':repo', component: repo_detail_component_1.RepoDetailComponent }
                ]
            }
        ]
    },
    { path: 'contact', component: contact_component_1.ContactComponent }
];


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".form-content {\r\n  width: 90%;\r\n  max-width: 600px;\r\n  margin: 0 auto;\r\n}\r\n.form-content .sd-form-control {\r\n  display: block;\r\n  margin-bottom: 10px;\r\n  width: 100%;\r\n  padding: 10px;\r\n}\r\n.form-content textarea.sd-form-control {\r\n  max-width: 100%;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(69);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(103);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(72),
  Html4Entities: __webpack_require__(71),
  Html5Entities: __webpack_require__(32),
  AllHtmlEntities: __webpack_require__(32)
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 72 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n            <div class=\"box\">\r\n                <div class=\"col-lg-12\">\r\n                    <hr>\r\n                    <h2 class=\"intro-text text-center\">About\r\n                        <strong>business casual</strong>\r\n                    </h2>\r\n                    <hr>\r\n                </div>\r\n                <div class=\"col-md-6\">\r\n                    <img class=\"img-responsive img-border-left\" src=\"http://assets-murali.azureedge.net/assets/slide-2.jpg\" alt=\"\">\r\n                </div>\r\n                <div class=\"col-md-6\">\r\n                    <p>This is a great place to introduce your company or project and describe what you do.</p>\r\n                    <p>Lid est laborum dolo rumes fugats untras. Etharums ser quidem rerum facilis dolores nemis omnis fugats vitaes nemo minima rerums unsers sadips amets.</p>\r\n                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n            </div>\r\n</div>\r\n<div class=\"row\">\r\n            <div class=\"box\">\r\n                <div class=\"col-lg-12\">\r\n                    <hr>\r\n                    <h2 class=\"intro-text text-center\">Our\r\n                        <strong>Team</strong>\r\n                    </h2>\r\n                    <hr>\r\n                </div>\r\n                <div class=\"col-sm-4 text-center\">\r\n                    <img class=\"img-responsive\" src=\"http://placehold.it/750x450\" alt=\"\">\r\n                    <h3>John Smith\r\n                        <small>Job Title</small>\r\n                    </h3>\r\n                </div>\r\n                <div class=\"col-sm-4 text-center\">\r\n                    <img class=\"img-responsive\" src=\"http://placehold.it/750x450\" alt=\"\">\r\n                    <h3>John Smith\r\n                        <small>Job Title</small>\r\n                    </h3>\r\n                </div>\r\n                <div class=\"col-sm-4 text-center\">\r\n                    <img class=\"img-responsive\" src=\"http://placehold.it/750x450\" alt=\"\">\r\n                    <h3>John Smith\r\n                        <small>Job Title</small>\r\n                    </h3>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n            </div>\r\n        </div>\r\n";

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "\r\n<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\">\r\n  <div class=\"container\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navigation\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"sr-only\">Toggle navigation</span>\r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"#\">\r\n        <strong>Muralidharan Nandakumar</strong></a>\r\n    </div>\r\n\r\n    <div class=\"collapse navbar-collapse\" id=\"navigation\">\r\n      <ul class=\"nav navbar-nav navbar-right\">\r\n        <li class=\"nav-item\"><a routerLinkActive=\"active\" [routerLink]=\"['/']\">Home</a></li>\r\n        <!-- <li class=\"nav-item\"><a routerLinkActive=\"active\" [routerLink]=\"['/about']\">About</a></li> -->\r\n        <!-- <li class=\"nav-item\"><a routerLinkActive=\"active\" [routerLink]=\"['/github', 'angular']\">Github</a></li> -->\r\n        <li class=\"nav-item\"><a routerLinkActive=\"active\" [routerLink]=\"['/contact']\">Contact</a></li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</nav>\r\n<main>\r\n\t<router-outlet></router-outlet>\r\n</main>\r\n<footer>\r\n  © 2016.v1.0.1\r\n</footer>\r\n\r\n";

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n            <div class=\"box\">\r\n                <div class=\"col-lg-12\">\r\n                    <hr>\r\n                    <h2 class=\"intro-text text-center\">Location\r\n                        <strong>You can find me here!</strong>\r\n                    </h2>\r\n                    <hr>\r\n                </div>\r\n                <div class=\"col-md-8\">\r\n                    <!-- Embedded Google Map using an iframe - to select your location find it on Google maps and paste the link as the iframe src. If you want to use the Google Maps API instead then have at it! -->\r\n                    <iframe\r\n                        width=\"100%\"\r\n                        height=\"400\"\r\n                        frameborder=\"0\" style=\"border:0\"\r\n                        src=\"https://www.google.com/maps/embed/v1/place?key=AIzaSyATiAHdWnXppvBLvtBJPxm25rVFSXJMB4w&q=Singapore,Singapore\" allowfullscreen>\r\n                    </iframe>\r\n                </div>\r\n                <div class=\"col-md-4\">\r\n                    <p>Phone:\r\n                        <strong>+65-91787630</strong>\r\n                    </p>\r\n                    <p>Email:\r\n                        <strong><a href=\"mailto:name@example.com\">mura0009@e.ntu.edu.sg</a></strong>\r\n                    </p>\r\n                </div>\r\n                <div class=\"clearfix\"></div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row\">\r\n            <div class=\"box\">\r\n                <div class=\"col-lg-12\">\r\n                    <hr>\r\n                    <h2 class=\"intro-text text-center\">Contact\r\n                        <strong>form</strong>\r\n                    </h2>\r\n                    <hr>\r\n                    <p>You can contact me here for consulting, queries or just sent me an invite for a coffee.</p>\r\n                    <form role=\"form\">\r\n                        <div class=\"row\">\r\n                            <div class=\"form-group col-lg-4\">\r\n                                <label>Name</label>\r\n                                <input type=\"text\" class=\"form-control\">\r\n                            </div>\r\n                            <div class=\"form-group col-lg-4\">\r\n                                <label>Email Address</label>\r\n                                <input type=\"email\" class=\"form-control\">\r\n                            </div>\r\n                            <div class=\"form-group col-lg-4\">\r\n                                <label>Phone Number</label>\r\n                                <input type=\"tel\" class=\"form-control\">\r\n                            </div>\r\n                            <div class=\"clearfix\"></div>\r\n                            <div class=\"form-group col-lg-12\">\r\n                                <label>Message</label>\r\n                                <textarea class=\"form-control\" rows=\"6\"></textarea>\r\n                            </div>\r\n                            <div class=\"form-group col-lg-12\">\r\n                                <input type=\"hidden\" name=\"save\" value=\"contact\">\r\n                                <button type=\"submit\" class=\"btn btn-default\">Submit</button>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n            </div>\r\n        </div>";

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "<h3>GitHub Browser</h3>\r\n\r\n<input type=\"text\" #repoName placeholder=\"Search Github Orgs\">\r\n<button (click)=\"searchForOrg(repoName.value)\">Search Orgs</button>\r\n\r\n<router-outlet></router-outlet>\r\n";

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "<h2>{{ repoDetails.full_name }}</h2>\r\n\r\n<pre>this.repoDetails = {{ repoDetails | json }}</pre>\r\n";

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "<h3>Repo list</h3>\r\n<ul>\r\n\t<li *ngFor=\"let repo of repos | async\">\r\n    <a [routerLink]=\"['/github', repo.owner.login, repo.name]\">\r\n      {{ repo.name }}\r\n    </a>\r\n  </li>\r\n</ul>\r\n\r\n<router-outlet></router-outlet>\r\n";

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "<div class=\"box\">\r\n    <div class=\"col-lg-12 text-center\">\r\n        <h2 class=\"brand-before\">\r\n            <small></small>\r\n        </h2>\r\n        <h1 class=\"brand-name\">Murali Nandakumar</h1>\r\n        <hr class=\"tagline-divider\">\r\n        <h2>\r\n            <small>\r\n                <strong>Passion and Endurance</strong>\r\n            </small>\r\n        </h2>\r\n        <div id=\"carousel-example-generic\" class=\"carousel slide\">\r\n            <!-- Indicators -->\r\n            <ol class=\"carousel-indicators hidden-xs\">\r\n                <li data-target=\"#carousel-example-generic\" data-slide-to=\"0\" class=\"active\"></li>\r\n                <li data-target=\"#carousel-example-generic\" data-slide-to=\"1\"></li>\r\n                <li data-target=\"#carousel-example-generic\" data-slide-to=\"2\"></li>\r\n            </ol>\r\n\r\n            <!-- Wrapper for slides -->\r\n            <div class=\"carousel-inner\">\r\n                <div class=\"item active\">\r\n                    <img class=\"img-full\" src=\"http://assets-murali.azureedge.net/assets/slide-1.jpg\" alt=\"\">\r\n                </div>\r\n                <div class=\"item\">\r\n                    <img class=\"img-full\" src=\"http://assets-murali.azureedge.net/assets/slide-2.jpg\" alt=\"\">\r\n                </div>\r\n                <div class=\"item\">\r\n                    <img class=\"img-full\" src=\"http://assets-murali.azureedge.net/assets/slide-3.jpg\" alt=\"\">\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Controls -->\r\n            <a class=\"left carousel-control\" href=\"#carousel-example-generic\" data-slide=\"prev\">\r\n                <span class=\"icon-prev\"></span>\r\n            </a>\r\n            <a class=\"right carousel-control\" href=\"#carousel-example-generic\" data-slide=\"next\">\r\n                <span class=\"icon-next\"></span>\r\n            </a>\r\n        </div>\r\n        \r\n    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"box\">\r\n        <div class=\"col-lg-12\">\r\n            <div class=\"col-lg-12 text-center\">\r\n                <div class=\"col-lg-6 col-md-6 col-sm-12\">\r\n                    <a href=\"https://www.linkedin.com/in/muralidharannandakumar/\"> \r\n                        <h2>\r\n                            <small>\r\n                                <strong>LinkedIn</strong>\r\n                            </small>\r\n                        </h2>   \r\n                    <!-- <img class=\"img-responsive img-full\" Height=\"100px\" src=\"./assets/img/linkedin.png\" alt=\"\"> -->\r\n                    </a>\r\n                </div>\r\n                <div class=\"col-lg-6 col-md-6 col-sm-12\">\r\n                    <a href=\"https://github.com/murali0009\"> \r\n                        <h2>\r\n                            <small>\r\n                                <strong>Github</strong>\r\n                            </small>\r\n                        </h2> \r\n                    <!-- <img class=\"img-responsive img-full\" Height=\"100px\" src=\"./assets/img/github.png\" alt=\"\"> -->\r\n                    </a>\r\n                </div>                \r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"box\">\r\n        <div class=\"col-lg-12\">\r\n            <hr>\r\n            <h2 class=\"intro-text text-center\">It's Me\r\n                 <!-- <strong>Intro</strong> -->\r\n            </h2>\r\n            <hr>\r\n            <div class=\"col-lg-12 text-center\">\r\n                <p>Software Developer with passion. Excited About IoT, Cloud Technologies.</p>\r\n                <p>I am skilled at HTML5, JavaScript, C#, ASP.NET MVC, Xamarin, SQL and MEAN stack. I dabble in CSS, Python and F# </p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(80);
exports.encode = exports.stringify = __webpack_require__(81);


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(105), __webpack_require__(11)))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(57)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(62);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(63);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(64);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(65);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(66);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(67);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(56);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(70).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(0);

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(108);

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(110);

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(215);

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(216);

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(221);

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(226);

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(25);

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(270);

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(282);

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(283);

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(72);

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(8);

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(38);
__webpack_require__(37);
module.exports = __webpack_require__(36);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map