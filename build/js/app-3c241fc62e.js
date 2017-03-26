(function () {
	/* global requirejs */
	"use strict";

	var myApp = angular
		.module("app", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
			"LocalStorageModule"
		]);

	myApp.config(function(localStorageServiceProvider) {
		localStorageServiceProvider
    		.setPrefix('');
	});

	myApp.run(serviceInitialization);

	serviceInitialization.$inject = ['$log', 'encounter', 'players', 'partyInfo'];

	function serviceInitialization($log, encounter, players, partyInfo) {
		$log.log("Service initialization on app run");
		partyInfo.initialize();
		encounter.initialize();
		players.initialize();
	}
})();
(function() {
	'use strict';

	angular
		.module('app')
		.run(appRun);

	appRun.$inject = ['routerHelper'];

	function appRun(routerHelper) {
		var otherwise = "/encounter-builder";
		routerHelper.configureStates(getStates(), otherwise);
	}

	function getStates() {
		return [
			{
				state: "battle-setup",
				config: {
					url: "/battle-setup",
					templateUrl: "app/battle-setup/battle-setup.html",
					controller: 'BattleSetupController',
					controllerAs: "vm"
				}
			},
			{
				state: "battle-tracker",
				config: {
					url: "/fight",
					templateUrl: "app/battle-tracker/battle-tracker.html",
					controller: 'BattleTrackerController',
					controllerAs: "vm"
				}
			},
			{
				state: "encounter-builder",
				config: {
					url: "/encounter-builder",
					templateUrl: "app/encounter-builder/encounter-builder.html",
					controller: 'EncounterBuilderController',
					controllerAs: "vm"
				}
			},
			{
				state: "encounter-manager",
				config: {
					url: "/encounter-manager",
					templateUrl: "app/encounter-manager/encounter-manager.html",
					controller: 'EncounterManagerController',
					controllerAs: "vm"
				}
			},
			{
				state: "players",
				config: {
					url: "/players",
					templateUrl: "app/players/players.html",
					controller: 'PlayersController',
					controllerAs: "vm"
				}
			},
			{
				state: "players.manage",
				config: {
					url: "/manage",
					templateUrl: "app/players/manage.html",
					controller: 'ManagePlayersController',
					controllerAs: "vm"
				}
			},
						{
				state: "players.edit",
				config: {
					url: "/edit",
					templateUrl: "app/players/edit.html",
					controller: 'EditPlayersController',
					controllerAs: "vm"
				}
			},
			{
				state: "about",
				config: {
					url: "/about",
					templateUrl: "app/about/about.html",
					controller: angular.noop,
					controllerAs: "vm"
				}
			},
			{
				state: "test",
				config: {
					url: "/test",
					templateUrl: "app/test.html",
					controller: 'TestController',
					controllerAs: "vm"
				}
			}
		];
	}

})();


(function() {
	'use strict';

	angular
		.module('app')
		.controller('BattleSetupController', BattleSetupController);

	BattleSetupController.$inject = ['$state', 'actionQueue', 'combat', 'combatConstants', 'integration'];

	function BattleSetupController($state, actionQueue, combat, combatConstants, integration) {
		var vm = this;
		
		vm.combat = combat;

		vm.launchImpInit = integration.launchImpInit;

		activate();

		////////////////

		function activate() {
			var combatState = combat.init(),
				forward;

			if ( combatState & combatConstants.NO_PLAYERS ) {
				actionQueue.unshift("players.manage", "You must select a party");
				forward = true;
			}

			if ( combatState & combatConstants.NO_MONSTERS ) {
				actionQueue.unshift("encounter-manager", "You must select an encounter");
				forward = true;
			}

			if ( forward ) {
				// In the end, send them back here
				actionQueue.queue("battle-setup");

				actionQueue.next($state);
			}
		}
	}
})();

(function() {
'use strict';

    angular
        .module('app')
        .component('combatantSetup', {
            templateUrl: 'app/battle-setup/combatant-setup.html',
            controller: 'combatantSetupController',
            controllerAs: "vm",
            bindings: {
                combatant: '<'
            },
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('combatantSetupController', CombatantSetupController);

    CombatantSetupController.$inject = ['combat'];
    function CombatantSetupController(combat) {
        var vm = this;
        vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();
(function() {
'use strict';

	angular
		.module('app')
		.controller('BattleTrackerController', BattleTrackerController);

	BattleTrackerController.$inject = ['$state', 'combat'];

	function BattleTrackerController($state, combat) {
		var vm = this;
		vm.combat = combat;

		activate();

		////////////////

		function activate() { 
			if ( !combat.combatants || !combat.combatants.length ) {
				$state.go("encounter-builder");
			}
			
			combat.begin();
		}
	}
})();
(function() {
'use strict';

    angular
        .module('app')
        .component('combatant', {
            templateUrl: 'app/battle-tracker/combatant.html',
            controller: CombatantController,
            controllerAs: 'vm',
            bindings: {
                combatant: '<'
            },
        });

    CombatantController.$inject = ['combat'];
    function CombatantController(combat) {
        var vm = this;
        vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();
(function () {
	"use strict";

	angular.module("app")
		.constant("combatConstants", {
			READY       : 1,
			NO_MONSTERS : 2,
			NO_PLAYERS  : 4
		})
		.constant("AppVersion", 1);
})();
(function() {
    'use strict';

    angular
        .module('app')
        .component('difficultyLegend', {
            bindings: {
                showHeader: '<'
            },
            controllerAs: 'vm',
            templateUrl: 'app/common/difficulty-legend.html'
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('NumberInputController', NumberInputController);

    NumberInputController.$inject = [];

    function NumberInputController() {
        var vm = this;
        vm.modify = modify;
        vm.hideNegative = hideNegative;

        activate();

        ////////////////

        function activate() { }

        function modify(amt) {
            vm.value += amt;

            if ( vm.nonNegative && vm.value < 0 ) {
                vm.value = 0;
            }
        }

        function hideNegative() {
            return vm.nonNegative && vm.value === 0;
        }
    }
})();
(function() {
	"use strict";

	angular.module('app')
		.directive('numberInput', NumberInput);

	function NumberInput() {
		return {
			restrict: "E",
			scope: {},
			bindToController: {
				value: '=model',
				mods: '=buttons',
				nonNegative: '=nonNegative'
			},
			templateUrl: "app/common/number-input.html",
			controller: 'NumberInputController',
			controllerAs: 'vm'
		};
	}
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('currentEncounter', {
            bindings: {
                filters: '<'
            },
            controller: 'CurrentEncounterController',
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/current-encounter.html'
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('CurrentEncounterController', CurrentEncounterController);

    CurrentEncounterController.$inject = ['encounter'];
    function CurrentEncounterController(encounter) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.generateRandom = generateRandom;
        vm.randomButtonText = randomButtonText;

        var lastDifficulty = "medium";
        
        function generateRandom(difficulty) {
            difficulty = difficulty || lastDifficulty;
            encounter.generateRandom(vm.filters, difficulty);
            lastDifficulty = difficulty;
        }

        function randomButtonText() {
            return "Random " + _.capitalize(lastDifficulty);
        }
    }
})();
(function () {
	"use strict";

	angular.module("app")
		.controller("EncounterBuilderController", EncounterBuilderController);

	EncounterBuilderController.$inject = ['$scope', '$log', 'store', 'actionQueue', 'encounter', 'monsters', 'sources'];

	function EncounterBuilderController($scope, $log, store, actionQueue, encounter, monsters, sources) {
		var vm = this;

		vm.encounter = encounter;
		vm.getMonsterQtyString = getMonsterQtyString;

		activate();

		function activate() {
			// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
			actionQueue.clear();

			vm.filters = {
				source: sources.filters,
				pageSize: 10,
			};

			store.get("5em-filters").then(function (frozen) {
				if (frozen) {
					$log.log('Thaw filters');
					vm.filters = frozen;
				}
			})
			.finally(function() {
				$scope.$watch("vm.filters", function () {
					$log.log('Freeze filters');
					store.set("5em-filters", vm.filters);
				}, true);
			});
		}

		function getMonsterQtyString() {
			var qty = Object.keys(vm.encounter.groups).reduce(function (sum, key) {
				return sum + vm.encounter.groups[key].qty;
			}, 0);

			if ( qty === 1 ) {
				return "1 enemy";
			}

			return qty + " enemies";
		};
	}
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('groupInfo', {
            controller: 'GroupInfoController',
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/group-info.html'
        });
})();
(function() {
'use strict';

  angular
    .module('app')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['encounter', 'playerLevels', 'partyInfo'];
  function GroupInfoController(encounter, playerLevels, partyInfo) {
    var vm = this;

    vm.encounter = encounter;
    vm.partyInfo = partyInfo;
    vm.addPartyLevel = addPartyLevel;

    function addPartyLevel() {
      partyInfo.partyLevels.push({
        level: playerLevels[1],
        playerCount: 1
      });

      partyInfo.freeze();
    }
  }
})();
(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('monsterTable', {
            templateUrl: 'app/encounter-builder/monster-table.html',
            controller: 'monsterTableController',
            controllerAs: 'vm',
            bindings: {
                filters: '<'
            },
        });
})();
(function() {
'use strict';

    angular.module('app')
        .controller('monsterTableController', MonsterTableController);
    
    MonsterTableController.$inject = ['encounter', 'monsters', 'sources'];
    function MonsterTableController(encounter, monsters, sources) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.monsters = monsters.all;
        vm.sources = sources;
        vm.dangerZone = dangerZone;
        
        ////////////////

        vm.$onInit = function() { };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestory = function() { };

        function dangerZone(monster) {
            if ( !monster ) {
                return null;
            }

            var threat = encounter.threat,
                monsterExp = monster.cr.exp;
                
            if ( monsterExp > threat.deadly ) {
                return "deadly";
            } else if ( monsterExp > threat.hard ) {
                return "hard";
            } else if ( monsterExp > threat.medium ) {
                return "medium";
            } else if ( monsterExp > threat.easy ) {
                return "easy";
            } else if ( monsterExp > threat.pair ) {
                return "pair";
            } else if ( monsterExp > threat.group ) {
                return "group";
            } else {
                return "trivial";
            }
        };
    }
})();

(function() {
'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('app')
    .component('partyLevelSelector', {
      templateUrl: 'app/encounter-builder/party-level-selector.html',
      controller: 'PartyLevelSelectorController',
      controllerAs: 'vm',
      bindings: {
        partyLevel: '=',
        first: '<'
      },
    });
})();
(function() {
'use strict';

  angular
    .module('app')
    .controller('PartyLevelSelectorController', PartyLevelSelectorController);

  PartyLevelSelectorController.inject = ['playerLevels', 'partyInfo'];
  function PartyLevelSelectorController(playerLevels, partyInfo) {
    var vm = this;

    vm.levels = playerLevels;
    vm.save = save;
    vm.addPartyLevel = addPartyLevel;
    vm.removePartyLevel = removePartyLevel;

    function save() {
      partyInfo.freeze();
    }

    function addPartyLevel() {
      partyInfo.partyLevels.push({
        level: playerLevels[1],
        playerCount: 1
      });

      partyInfo.freeze();
    }

    function removePartyLevel(partyLevel) {
      var index = partyInfo.partyLevels.indexOf(partyLevel);
      partyInfo.partyLevels.splice(index, 1);

      partyInfo.freeze();
    }
  }
})();
(function() {
'use strict';

    angular
        .module('app')
        .component('searchControls', {
            templateUrl: 'app/encounter-builder/search.html',
            controller: 'SearchController',
            controllerAs: 'vm',
            bindings: {
                filters: '<'
            },
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'sources', 'metaInfo', 'store'];
    function SearchController($scope, sources, metaInfo, store) {
        var vm = this;

        vm.alignments = metaInfo.alignments;
        vm.crList = metaInfo.crList;
        vm.environments = metaInfo.environments;
        vm.sizes = metaInfo.sizes;
        vm.sourceNames = sources.all;
        vm.types = metaInfo.types;

        vm.resetFilters = resetFilters;
        vm.updateSourceFilters = updateSourceFilters;

        activate();

        ////////////////

        function activate() {
        }

        function resetFilters() {
            vm.filters.size = null;
            vm.filters.type = null;
            vm.filters.alignment = null;
            vm.filters.minCr = null;
            vm.filters.maxCr = null;
            vm.filters.environment = null;
        };

        function updateSourceFilters(newValue) {
            if (newValue) {
                vm.filters.sources = newValue;
            }
            // The default is core, but for implementation reasons it's represented by the empty string
            var sourceTypes = vm.filters.sources || "core",
                select = [ ],
                i;

            if ( sourceTypes === "custom" ) {
                return;
            }

            if ( sourceTypes.match(/all|core|books/) ) {
                select.push("Player's Handbook");
                select.push("Monster Manual");
                select.push("Volo's Guide to Monsters");
            }

            if ( sourceTypes.match(/all|books/) ) {
                select.push("Hoard of the Dragon Queen");
                select.push("Rise of Tiamat");
                select.push("Princes of the Apocalypse");
                select.push("Out of the Abyss");
                select.push("Curse of Strahd");
                select.push("Storm King's Thunder"); 
            }

            if ( sourceTypes.match(/all|basic/) ) {
                select.push("Basic Rules v1");
                select.push("HotDQ supplement");
                select.push("Princes of the Apocalypse Online Supplement v1.0");
            }
            
            if ( sourceTypes.match(/all|thirdparty/) ) {
                select.push("Monster-A-Day");
                select.push("Fifth Edition Foes");
                select.push("Primeval Thule Campaign Setting");
                select.push("Primeval Thule Gamemaster's Companion");
                select.push("Tome of Beasts");
            }

            for ( i = 0; i < sources.all.length; i++ ) {
                vm.filters.source[sources.all[i]] = false;
            }

            while (select.length) {
                vm.filters.source[select.pop()] = true;
            }
        };
    }
})();
(function() {
	'use strict';

	angular
		.module('app')
		.controller('EncounterManagerController', EncounterManagerController);

	EncounterManagerController.$inject = ['$scope', '$state', 'actionQueue', 'encounter', 'library', 'monsters'];

	function EncounterManagerController($scope, $state, actionQueue, encounter, library, monsters) {
		var vm = this;

		vm.encounter = encounter;
		vm.library = library;
		vm.monsters = monsters;

		vm.save = save;

		activate();

		///////////////////
		
		function activate() {
			var placeholder = [];

			Object.keys(encounter.groups).forEach(function (id) {
				placeholder.push([
					(encounter.groups[id].qty > 1) ? encounter.groups[id].qty + "x" : "",
					encounter.groups[id].monster.name,
				].join(" "));
			});

			vm.newEncounter = {
				placeholder: placeholder.join(", "),
				name: "",
			};
		}

		function save() {
			var newLibraryEntry = {
					name: vm.newEncounter.name || vm.newEncounter.placeholder,
					groups: {},
			};

			Object.keys(encounter.groups).forEach(function (id) {
				newLibraryEntry.groups[id] = encounter.groups[id].qty;
			});
			
			encounter.reference = library.store(newLibraryEntry);
		}

		vm.load = function (storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		};

		vm.remove = function ( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		};
	}
})();
(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('managerRow', {
            templateUrl:'app/encounter-manager/manager-row.html',
            controller: 'managerRowController',
            controllerAs: 'vm',
            bindings: {
                storedEncounter: '<'
            }
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('managerRowController', ManagerRowController);

    ManagerRowController.$inject = ['$state', 'encounter', 'monsters', 'actionQueue', 'library'];
    function ManagerRowController($state, encounter, monsters, actionQueue, library) {
        var vm = this;

        vm.calculateExp = calculateExp;
        vm.load = load;
        vm.remove = remove;
        vm.encounter = encounter;
        vm.monsters = monsters;

        activate();

        ////////////////

        function activate() { }

        function calculateExp(storedEncounter) {
			var exp = 0;

			_.forEach(storedEncounter.groups, function (value, id) {
				exp += monsters.byId[id].cr.exp * storedEncounter.groups[id];
			});

			return exp;
		};

		function load(storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		};

        function remove( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		};
    }
})();
(function() {
	"use strict";

	angular.module("app")
		.filter("monstersFilter", SortAndFilterMonsters);

	SortAndFilterMonsters.$inject = ["monsterFactory"];

	function SortAndFilterMonsters(monsterLib) {
		return function ( input, filters ) {
			if (!input) return [];
			var output = [], i;

			for ( i = 0; i < input.length; i++ ) {
				if ( monsterLib.checkMonster(input[i], filters) ) {
					output.push(input[i]);
				}
			}

			// Monsters are already sorted by name
			if ( filters.sort === "size" ) {
				output.sort(function (a, b) {
					return a.sizeSort - b.sizeSort;
				});
			} else if ( filters.sort === "type" ) {
				output.sort(function (a, b) {
					return (a.type > b.type) ? 1 : -1;
				});
			} else if ( filters.sort === "alignment" ) {
				output.sort(function (a, b) {
					return ((a.alignment||{text:"zzzzzzz"}).text > (b.alignment||{text:"zzzzzzz"}).text) ? 1 : -1;
				});
			} else if ( filters.sort === "cr" ) {
				output.sort(function (a, b) {
					return a.cr.numeric - b.cr.numeric;
				});
			}

			return output;
		};
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.filter("positive", function PositiveFilter() {
				return function ( input ) {
					input = input || '';
					var output = [],
						i;

					for ( i = 0; i < input.length; i++ ) {
						if ( input[i] > 0 ) {
							output.push(input[i]);
						}
					}

					return output;
				};
			})
		.filter("negative", function NegativeFilter() {
				return function ( input ) {
					input = input || '';
					var output = [],
						i;

					for ( i = 0; i < input.length; i++ ) {
						if ( input[i] < 0 ) {
							output.push(input[i]);
						}
					}

					return output;
				};
			});
})();

(function() {
	'use strict';

	angular.module('app')
		.filter('sortEncounter', SortEncounter);

	function SortEncounter() {
		return function (items) {
			var sorted = [];

			Object.keys(items).forEach(function (key) {
				sorted.push(items[key]);
			});

			sorted.sort(function (a, b) {
				return (a.monster.name > b.monster.name) ? 1 : -1;
			});

			return sorted;
		};
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.service("alignments", AlignmentsService);

	function AlignmentsService() {
		var i = 0,
			lg = Math.pow(2, i++),
			ng = Math.pow(2, i++),
			cg = Math.pow(2, i++),
			ln = Math.pow(2, i++),
			n  = Math.pow(2, i++),
			cn = Math.pow(2, i++),
			le = Math.pow(2, i++),
			ne = Math.pow(2, i++),
			ce = Math.pow(2, i++),
			unaligned = Math.pow(2, i++);
		var alignments = {
			any: {
				text: "any",
				flags: lg | ng | cg | ln | n | cn | le | ne | ce
			},
			any_chaotic: {
				text: "any chaotic",
				flags: cg | cn | ce
			},
			any_evil: {
				text: "any evil",
				flags: le | ne | ce
			},
			any_good: {
				text: "any good",
				flags: lg | ng | cg
			},
			any_lawful: {
				text: "any lawful",
				flags: lg | ln | le
			},
			any_neutral: {
				text: "any neutral",
				flags: ng | ln | n | cn | ne
			},
			non_chaotic: {
				text: "non-chaotic",
				flags: lg | ng | ln | n | le | ne | unaligned
			},
			non_evil: {
				text: "non-evil",
				flags: lg | ng | cg | ln | n | cn | unaligned
			},
			non_good: {
				text: "non-good",
				flags: ln | n | cn | le | ne | ce | unaligned
			},
			non_lawful: {
				text: "non-lawful",
				flags: ng | cg | n | cn | ne | ce | unaligned
			},
			unaligned: {
				text: "unaligned",
				flags: unaligned 
			},
			lg: { flags: lg, text: "lawful good" },
			ng: { flags: ng, text: "neutral good" },
			cg: { flags: cg, text: "chaotic good" },
			ln: { flags: ln, text: "lawful neutral" },
			n:  { flags: n,  text: "neutral" },
			cn: { flags: cn, text: "chaotic neutral" },
			le: { flags: le, text: "lawful evil" },
			ne: { flags: ne, text: "neutral evil" },
			ce: { flags: ce, text: "chaotic evil" },
		};

		Object.keys(alignments).forEach(function (alignmentKey) {
			var alignment = alignments[alignmentKey];
			alignment.regex = new RegExp(alignment.text.replace(/[- ]/, "[- ]?"), "i");
		});

		return alignments;
	}
})();

(function () {
	"use strict";

	angular.module("app")
		.service("crInfo", CrInfoService);

	function CrInfoService() {
		return {
			"0":	{ string: "0",		numeric: 0,		exp: 10		},
			"1/8":	{ string: "1/8",	numeric: 0.125,	exp: 25		},
			"1/4":	{ string: "1/4",	numeric: 0.25,	exp: 50		},
			"1/2":	{ string: "1/2",	numeric: 0.5,	exp: 100	},
			"1":	{ string: "1",		numeric: 1,		exp: 200	},
			"2":	{ string: "2",		numeric: 2,		exp: 450	},
			"3":	{ string: "3",		numeric: 3,		exp: 700	},
			"4":	{ string: "4",		numeric: 4,		exp: 1100	},
			"5":	{ string: "5",		numeric: 5,		exp: 1800	},
			"6":	{ string: "6",		numeric: 6,		exp: 2300	},
			"7":	{ string: "7",		numeric: 7,		exp: 2900	},
			"8":	{ string: "8",		numeric: 8,		exp: 3900	},
			"9":	{ string: "9",		numeric: 9,		exp: 5000	},
			"10":	{ string: "10",		numeric: 10,	exp: 5900	},
			"11":	{ string: "11",		numeric: 11,	exp: 7200	},
			"12":	{ string: "12",		numeric: 12,	exp: 8400	},
			"13":	{ string: "13",		numeric: 13,	exp: 10000	},
			"14":	{ string: "14",		numeric: 14,	exp: 11500	},
			"15":	{ string: "15",		numeric: 15,	exp: 13000	},
			"16":	{ string: "16",		numeric: 16,	exp: 15000	},
			"17":	{ string: "17",		numeric: 17,	exp: 18000	},
			"18":	{ string: "18",		numeric: 18,	exp: 20000	},
			"19":	{ string: "19",		numeric: 19,	exp: 22000	},
			"20":	{ string: "20",		numeric: 20,	exp: 25000	},
			"21":	{ string: "21",		numeric: 21,	exp: 33000	},
			"22":	{ string: "22",		numeric: 22,	exp: 41000	},
			"23":	{ string: "23",		numeric: 23,	exp: 50000	},
			"24":	{ string: "24",		numeric: 24,	exp: 62000	},
			"25":	{ string: "25",		numeric: 25,	exp: 75000	},
			"26":	{ string: "26",		numeric: 26,	exp: 90000	},
			"27":	{ string: "27",		numeric: 27,	exp: 105000	},
			"28":	{ string: "28",		numeric: 28,	exp: 120000	},
			"29":	{ string: "29",		numeric: 29,	exp: 135000	},
			"30":	{ string: "30",		numeric: 30,	exp: 155000	},
		};
	}
})();

(function() {
'use strict';

  angular
    .module('app')
    .value('playerLevels', {
      1: { level: 1,		easy: 25,	medium: 50,		hard: 75,	deadly: 100 },
      2: { level: 2,		easy: 50,	medium: 100,	hard: 150,	deadly: 200 },
      3: { level: 3,		easy: 75,	medium: 150,	hard: 225,	deadly: 400 },
      4: { level: 4,		easy: 125,	medium: 250,	hard: 375,	deadly: 500 },
      5: { level: 5,		easy: 250,	medium: 500,	hard: 750,	deadly: 1100 },
      6: { level: 6,		easy: 300,	medium: 600,	hard: 900,	deadly: 1400 },
      7: { level: 7,		easy: 350,	medium: 750,	hard: 1100,	deadly: 1700 },
      8: { level: 8,		easy: 450,	medium: 900,	hard: 1400,	deadly: 2100 },
      9: { level: 9,		easy: 550,	medium: 1100,	hard: 1600,	deadly: 2400 },
      10: { level: 10,	easy: 600,	medium: 1200,	hard: 1900,	deadly: 2800 },
      11: { level: 11,	easy: 800,	medium: 1600,	hard: 2400,	deadly: 3600 },
      12: { level: 12,	easy: 1000,	medium: 2000,	hard: 3000,	deadly: 4500 },
      13: { level: 13,	easy: 1100,	medium: 2200,	hard: 3400,	deadly: 5100 },
      14: { level: 14,	easy: 1250,	medium: 2500,	hard: 3800,	deadly: 5700 },
      15: { level: 15,	easy: 1400,	medium: 2800,	hard: 4300,	deadly: 6400 },
      16: { level: 16,	easy: 1600,	medium: 3200,	hard: 4800,	deadly: 7200 },
      17: { level: 17,	easy: 2000,	medium: 3900,	hard: 5900,	deadly: 8800 },
      18: { level: 18,	easy: 2100,	medium: 4200,	hard: 6300,	deadly: 9500 },
      19: { level: 19,	easy: 2400,	medium: 4900,	hard: 7300,	deadly: 10900 },
      20: { level: 20,	easy: 2800,	medium: 5700,	hard: 8500,	deadly: 12700 }
    });
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("monsterFactory", MonsterFactory);

	MonsterFactory.$inject = ["alignments", "crInfo"];

	function MonsterFactory(alignments, crInfo) {
		var factory = {
			checkMonster: checkMonster,
			Monster: Monster,
		};

		function Monster(args) {
			var monster = this;
			// guid is deprecated. Still need to work out plan to get rid of it, but for the time
			// being we can at least make it so new things don't need one by falling back to fid if
			// guid isn't supplied
			monster.id = args.guid || args.fid;
			monster.fid = args.fid;
			monster.name = args.name;
			monster.section = args.section;
			["ac", "hp", "init"].forEach(function (key) {
				// Try to parse each of these into a number, but if that fails then just give the
				// original string value, which presumably is either an empty string or something
				// complicated
				var parsed = Number.parseInt(args[key]);

				if ( isNaN(parsed) ) {
					parsed = args[key];
				}

				monster[key] = parsed;
			});
			monster.cr = crInfo[args.cr];
			monster.type = args.type;
			monster.tags = args.tags ? args.tags.split(/\s*,\s*/).sort() : null;
			monster.size = args.size;
			monster.alignment = parseAlignment(args.alignment);
			monster.environments = (args.environments) ? args.environments.sort() : [];
			// Special, legendary, lair, and unique are stored in spreadsheet as strings to make it
			// easy to read a row, but should be translated to booleans
			monster.special = !!args.special;
			monster.legendary = !!args.legendary;
			monster.lair = !!args.lair;
			monster.unique = !!args.unique;
			monster.sources = args.sources
				.split(/\s*,\s*/)
				.map(function (rawSource) {
					var sourceMatch = rawSource.match(/([^:]*): (.*)/);

					if ( !sourceMatch ) {
						// Just a source with no page or URL
						return { name: rawSource };
					}

					var name = sourceMatch[1];
					var where = sourceMatch[2];
					var out = {
						name: name,
					};

					if ( where.match(/^\d+$/) ) {
						out.page = Number.parseInt(where, 10);
					} else {
						out.url = where;
					}

					return out;
				});

			monster.sizeSort = parseSize(monster.size);
			monster.searchable = [
				monster.name,
				monster.section,
				monster.type,
				monster.size,
				(monster.alignment) ? monster.alignment.text : "",
			].concat(
				monster.cr.string
			).concat(
				monster.tags
			).join("|").toLowerCase();

			if ( args.name.match(/chronom/i) ) {
				console.log(args, monster);
			}
		}

		function parseAlignment(alignmentString) {
			var flags = (alignmentString || "")
				// alignmentString should be a string of alignments, seperated by commas, "or", or
				// commas followed by "or" (I'm pro-Oxford comma)
				.split(/\s*(,|or|,\s*or)\s*/i)
				.reduce(function (total, current) {
					return total | parseSingleAlignmentFlags(current);
				}, 0);

			if ( !flags ) {
				console.warn("Couldn't parse alignments: ", alignmentString);
				flags = alignments.unaligned.flags;
			}

			return {
				text: alignmentString,
				flags: flags,
			};
		}

		function parseSingleAlignmentFlags(alignment) {
			var flags;

			alignmentTestOrder.some(function (alignmentDefinition) {
				if ( alignment.match(alignmentDefinition.regex) ) {
					flags = alignmentDefinition.flags;
					return true;
				}
			});

			return flags;
		}

		// Check "neutral" and "any" last, since those are substrings found in more specific
		// alignments
		var alignmentTestOrder = [
			alignments.any_chaotic,
			alignments.any_evil,
			alignments.any_good,
			alignments.any_lawful,
			alignments.any_neutral,
			alignments.non_chaotic,
			alignments.non_evil,
			alignments.non_good,
			alignments.non_lawful,
			alignments.unaligned,
			alignments.lg,
			alignments.ng,
			alignments.cg,
			alignments.ln,
			alignments.cn,
			alignments.le,
			alignments.ne,
			alignments.ce,
			alignments.n,
			alignments.any,
		];

		function parseSize(size) {
			switch ( size ) {
				case "Tiny": return 1;
				case "Small": return 2;
				case "Medium": return 3;
				case "Large": return 4;
				case "Huge": return 5;
				case "Gargantuan": return 6;
				default: return -1;
			}
		}

		function checkMonster(monster, filters, args) {
			args = args || {};

			if ( filters.type && monster.type !== filters.type ) {
				return false;
			}

			if ( filters.size && monster.size !== filters.size ) {
				return false;
			}

			if ( args.nonUnique && monster.unique ) {
				return false;
			}

			if ( filters.alignment ) {
				if ( !monster.alignment ) {
					return false;
				}

				if ( ! (filters.alignment.flags & monster.alignment.flags) ) {
					return false;
				}
			}

			if ( !args.skipCrCheck ) {
				if ( filters.minCr && monster.cr.numeric < filters.minCr ) {
					return false;
				}

				if ( filters.maxCr && monster.cr.numeric > filters.maxCr ) {
					return false;
				}
			}

			if ( filters.environment && monster.environments.indexOf(filters.environment) === -1 ) {
				return false;
			}

			if ( !isInSource(monster, filters.source) ) {
				return false;
			}

			if ( filters.search && monster.searchable.indexOf(filters.search.toLowerCase()) === -1 ) {
				return false;
			}

			return true;
		}

		function isInSource(monster, sources) {
			if ( !monster || !monster.sources) {
				return false;
			}

			for ( var i = 0; i < monster.sources.length; i++ ) {
				if ( sources[monster.sources[i].name] ) {
					return true;
				}
			}

			return false;
		}

		return factory;
	}
})();

(function() {
'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('app')
    .component('navbar', {
      templateUrl: 'app/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: "vm",
      bindings: {
      },
    });

  function NavbarController() {
    var vm = this;
  }
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('EditPlayersController', EditPlayersController);

    EditPlayersController.$inject = ['players'];

    function EditPlayersController(players) {
        var vm = this;
        vm.players = players;

        activate();

        ////////////////

        function activate() { }
    }
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('ManagePlayersController', ManagePlayersController);

    ManagePlayersController.$inject = ['$state', 'actionQueue', 'players'];

    function ManagePlayersController($state, actionQueue, players) {
        var vm = this;

        vm.players = players;

        vm.select = function (party) {
            players.selectParty(party);

            actionQueue.next($state);
        };    

        activate();

        ////////////////

        function activate() { 
            // If there aren't any parties, send them to edit
            if ( !players.parties || !players.parties.length ) {
                $state.go("players.edit");
                return;
            }
        }
    }
})();
(function() {
'use strict';

	angular
		.module('app')
		.controller('PlayersController', PlayersController);

	PlayersController.$inject = [];
	
	function PlayersController() {
		var vm = this;

		activate();

		////////////////

		function activate() { }
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("actionQueue", ActionQueueService);


	function ActionQueueService() {
		var actionQueue = {
				actions: [],
				currentInstruction: "",
				clear: function () {
					actionQueue.actions.length = 0;
					actionQueue.currentInstruction = "";
				},
				next: function ($state) {
					if ( actionQueue.actions.length ) {
						var current = actionQueue.actions.shift();
						actionQueue.currentInstruction = current.message || "";

						$state.go(current.state);
						return true;
					}

					return false;
				},
				queue: function (nextState, message) {
					actionQueue.actions.push({ state: nextState, message: message });
				},
				unshift: function (nextState, message) {
					// First check to make sure this state isn't already in the queue
					var i = 0;
					while ( i < actionQueue.actions.length ) {
						if ( actionQueue.actions[i].state === nextState ) {
							actionQueue.actions.splice(i, 1);
						} else {
							i++;
						}
					}

					actionQueue.actions.unshift({ state: nextState, message: message });
				}
		};

		return actionQueue;
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("combat", CombatService);

	CombatService.$inject = ['store', 'encounter', 'integration', 'players', 'monsters', 'combatConstants'];

	function CombatService(store, encounter, integration, players, monsters, constants) {
		var combat = {
			active: 0,
			combatants: [],
			delta: 0,
			addMonster: function (monster, qty) {
				qty = qty || 1;

				var i, name;

				for ( i = 0; i < qty; i++ ) {
					name = [ monster.name ];

					if ( qty > 1 ) {
						name.push( i + 1 );
					}

					combat.combatants.push({
						type: "enemy",
						name: name.join(" "),
						ac: monster.ac,
						hp: monster.hp,
						initiativeMod: monster.init,
						initiative: 10 + monster.init,
						id: monster.id,
					});
				}
			},
			addLair: function () {
				combat.combatants.push({
					type: "lair",
					name: "Lair",
					iniativeMod: 0,
					initiative: 20,
					fixedInitiative: true,
					noHp: true,
				});
			},
			addPlayer: function (player) {
				combat.combatants.push({
					type: "player",
					name: player.name,
					initiativeMod: player.initiativeMod,
					initiative: player.initiative,
					hp: player.hp,
					damage: player.damage,
				});
			},
			applyDelta: function (combatant, multiplier) {
				multiplier = multiplier || 1;
				// Make sure damage is initialized
				combatant.damage = combatant.damage || 0;

				combatant.damage += combat.delta * multiplier;
				combat.delta = 0;

				// Damage can't reduce you below 0
				if ( combatant.damage > combatant.hp ) {
					combatant.damage = combatant.hp;
				}

				// Damage can't be negative
				if ( combatant.damage < 0 ) {
					combatant.damage = 0;
				}

				if ( combatant.type === "player" ) {
					players.setDamage(combatant.name, combatant.damage);
				}
			},
			begin: function () {
				combat.combatants.sort(function (a, b) {
					return b.initiative - a.initiative;
				});

				if (combat.combatants.length > 0) {			
					combat.combatants[combat.active].active = true;
				}
			},
			init: function () {
				combat.combatants.length = 0;
				combat.active = 0;
				combat.delta = 0;

				var monsterIds = Object.keys(encounter.groups),
					lair = false,
					i, monster, qty, player,
					retValue = 0;

				if ( ! monsterIds.length ) {
					// If there aren't any monsters, we can't run an encounter
					retValue |= constants.NO_MONSTERS;
				}

				if ( ! players.selectedParty ) {
					// If there aren't any players, we can't run the encounter either...
					retValue |= constants.NO_PLAYERS;
				}

				if ( retValue ) {
					return retValue;
				}

				for ( i = 0; i < players.selectedParty.length; i++ ) {
					player = players.selectedParty[i];
					combat.addPlayer({
						name: player.name,
						initiativeMod: player.initiativeMod,
						initiative: player.initiativeMod + 10,
						hp: player.hp,
						damage: player.damage,
					});
				}

				for ( i = 0; i < monsterIds.length; i++ ) {
					monster = monsters.byId[monsterIds[i]];
					qty = encounter.groups[monsterIds[i]].qty;
					lair = lair || monster.lair;

					combat.addMonster(monster, qty);
				}

				if ( lair ) {
					combat.addLair();
				}

				return constants.READY;
			},
			nextTurn: function () {
				combat.combatants[combat.active].active = false;
				combat.active = ( combat.active + 1 ) % combat.combatants.length;
				combat.combatants[combat.active].active = true;
			},
			rollInitiative: function (combatant) {
				var initRoll = _.random(20) + 1;
				combatant.initiative = initRoll + combatant.initiativeMod;
				combatant.initiativeRolled = true;
			},
		};

		combat.init();

		return combat;
	}
})();

(function () {
	"use strict";

	angular.module("app")
		.factory("encounter", EncounterService);

	EncounterService.$inject = ['$rootScope', '$log', 'randomEncounter', 'store', 'monsters', 'players', 'misc', 'playerLevels', 'partyInfo'];

	function EncounterService($rootScope, $log, randomEncounter, store, monsters, players, misc, playerLevels, partyInfo) {
		var encounter = {
				groups: {},
				reference: null,

				// Methods
				add: add,
				generateRandom: generateRandom,
				initialize: initialize,
				randomize: randomize,
				remove: remove,
				reset: reset,
				thaw: thaw,
				freeze: freeze,

				// Properties
				get adjustedExp() {			
					var qty = encounter.qty,
					exp = encounter.exp,
					multiplier = misc.getMultiplier(partyInfo.totalPlayerCount, qty);

					if (!_.isNumber(exp)) return 0;

					return Math.floor(exp * multiplier);
				},

				get difficulty() {
					var exp = encounter.adjustedExp,
						levels = partyInfo.totalPartyExpLevels;

					if ( exp === 0 ) {
						return false;
					}

					if ( exp < ( levels.easy ) ) {
						return '';
					} else if ( exp < ( levels.medium ) ) {
						return "Easy";
					} else if ( exp < ( levels.hard ) ) {
						return "Medium";
					} else if ( exp < ( levels.deadly ) ) {
						return "Hard";
					} else {
						return "Deadly";
					}
				},

				get exp() {
					if (_.isEmpty(encounter.groups)) return undefined;

					var exp = 0;

					_.forEach(encounter.groups, function(group) {
						exp += (group.monster.cr.exp * group.qty);
					});

					return exp;
				},

				get qty() {
					var qty = 0;

					_.forEach(encounter.groups, function(group) {
						qty += group.qty;
					});

					return qty;
				},

				get threat() {
					var count = partyInfo.totalPlayerCount,
						levels = partyInfo.totalPartyExpLevels,
						mediumExp = levels.medium,
						singleMultiplier  = 1,
						pairMultiplier    = 1.5,
						groupMultiplier   = 2,
						trivialMultiplier = 2.5;
					
					if ( count < 3 ) {
						// For small groups, increase multiplier
						singleMultiplier  = 1.5;
						pairMultiplier    = 2;
						groupMultiplier   = 2.5;
						trivialMultiplier = 3;
					} else if ( count > 5 ) {
						// For large groups, reduce multiplier
						singleMultiplier  = 0.5;
						pairMultiplier    = 1;
						groupMultiplier   = 1.5;
						trivialMultiplier = 2;
					}

					return {
						deadly : levels.deadly / singleMultiplier,
						hard   : levels.hard / singleMultiplier,
						medium : mediumExp / singleMultiplier,
						easy   : levels.easy / singleMultiplier,
						pair   : mediumExp / ( 2 * pairMultiplier ),
						group  : mediumExp / ( 4 * groupMultiplier ),
						trivial: mediumExp / ( 8 * trivialMultiplier ),
					};
				}
		};

		return encounter;
		
		function initialize() {
			thaw();
		}

		function add(monster, qty) {
			if ( typeof qty === "undefined" ) {
				qty = 1;
			}

			encounter.groups[monster.id] = encounter.groups[monster.id] || {
				qty: 0,
				monster: monster,
			};

			encounter.groups[monster.id].qty += qty;

			encounter.reference = null;
		}

		function generateRandom(filters, targetDifficulty) {
			targetDifficulty = targetDifficulty || 'medium';
			var totalTargetExp = partyInfo.totalPartyExpLevels[targetDifficulty];
			var monsters = randomEncounter.getRandomEncounter(partyInfo.totalPlayerCount, totalTargetExp, filters),
				i;

			encounter.reset();

			for ( i = 0; i < monsters.length; i++ ) {
				encounter.add( monsters[i].monster, monsters[i].qty );
			}
		}

		function randomize(monster, filters) {
			var monsterList = randomEncounter.getShuffledMonsterList(monster.cr.string),
				qty = encounter.groups[monster.id].qty;

			while ( monsterList.length ) {
				// Make sure we don't roll a monster we already have
				if ( encounter.groups[monsterList[0].name] ) {
					monsterList.shift();
					continue;
				}

				if ( monsters.check( monsterList[0], filters, { skipCrCheck: true } ) ) {
					encounter.remove(monster, true);
					encounter.add( monsterList[0], qty );
					return;					
				} else {
					monsterList.shift();
				}
			}
		}

		function remove(monster, removeAll) {
			encounter.groups[monster.id].qty--;

			if ( encounter.groups[monster.id].qty === 0 ) {
				delete encounter.groups[monster.id];
			} else if ( removeAll ) {
				// Removing all is implemented by recurively calling this function until the
				// qty is 0
				encounter.remove(monster, true);
			}

			encounter.reference = null;
		}

		function reset(storedEncounter) {
			encounter.reference = null;
			encounter.groups = {};

			if (storedEncounter) {
				Object.keys(storedEncounter.groups).forEach(function (id) {
					encounter.add(
						monsters.byId[id],
						storedEncounter.groups[id],
						{ skipFreeze: true }
					);
				});

				encounter.reference = storedEncounter;
			}
		}

		function freeze() {
			var o = {
				groups: {}
			};

			$log.log("Freezing encounter info", o);

			Object.keys(encounter.groups).forEach(function (monsterId) {
				o.groups[monsterId] = encounter.groups[monsterId].qty;
			});

			store.set("5em-encounter", o);
		}

		function thaw() {
			$log.log('Thawing encounter info');
			encounter.reset();

			return store.get("5em-encounter").then(function (frozen) {
				if ( !frozen ) {
					return;
				}				
				
			});
		}
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("integration", ExportService);


	// var payload = [{ "Name": "Nemo", "HP": { "Value": 10 } }, { "Name": "Fat Goblin", "HP": { "Value": 20 }, "Id": "mm.goblin"}, { "Id": "mm.goblin"}];
	var target = "http://improved-initiative.com/launchencounter/";
	ExportService.$inject = ["$document", "encounter", "players"];
	function ExportService($document, encounter, players) {
		function launchImpInit() {
			var payload = generatePayload({
				monsters: encounter.groups,
				players: players.selectedParty,
			});

			console.log(payload);

			openWindow({
				document: $document,
				target: target,
				data: { Combatants: payload },
			});
		}

		window.encounter = encounter;
		window.players = players;

		return {
			launchImpInit: launchImpInit,
		};
	}

	function generatePayload(args) {
		var combatants = [];

		Object.keys(args.monsters).forEach(function (guid) {
			var monsterGroup = args.monsters[guid];
			var monster = monsterGroup.monster;
			var qty = monsterGroup.qty;

			var i;
			for ( i = 1; i <= qty; i++ ) {

				combatants.push({
					Name: monster.name,
					HP: { Value: monster.hp },
					TotalInitiativeModifier: monster.init,
					AC: { Value: monster.ac },
					Player: "npc",
					Id: monster.fid,
				});
			}
		});

		args.players.forEach(function (player) {
			combatants.push({
				Name: player.name,
				TotalInitiativeModifier: player.initiativeMod,
				HP: { Value: player.hp },
				Player: "player",
			});
		});

		return combatants;
	}

	function openWindow(args) {
		var form = document.createElement("form");
		form.style.display = "none";
		form.setAttribute("method", "POST");
		// form.setAttribute("target", "self");
		form.setAttribute("action", args.target);

		Object.keys(args.data).forEach(function (key) {
			var textarea = document.createElement("input");
			textarea.setAttribute("type", "hidden");
			textarea.setAttribute("name", key);
			textarea.setAttribute("value", JSON.stringify(args.data[key]));

			form.appendChild(textarea);
		});

		args.document[0].body.appendChild(form);
		form.submit();
		form.parentNode.removeChild(form);
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("library", LibraryService);

	LibraryService.$inject = ["$rootScope", "$log", "store"];

	function LibraryService($rootScope, $log, store) {
		var library = {
				encounters: [],
				remove: function (storedEncounter) {
					library.encounters.splice(library.encounters.indexOf(storedEncounter), 1);

					freeze();
				},
				store: function (encounter) {
					 for ( var i = 0; i < library.encounters.length; i++ ) {
					 	if ( angular.equals(encounter, library.encounters[i]) ) {
					 		return library.encounters[i];
					 	}
					 }

					library.encounters.push(encounter);
					freeze();

					return encounter;
				}
		};

		thaw();

		function freeze() {
			$log.log('Freeze library');
			store.set("5em-library", library.encounters);
		}

		function thaw() {
			$log.log('Thaw library');
			store.get("5em-library").then(function (frozen) {
				if (frozen) {
					library.encounters = frozen;
				}
			});
		}

		return library;
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("metaInfo", MetaInfoService);

	MetaInfoService.$inject = ['misc', 'alignments', 'crInfo'];
	
	function MetaInfoService(miscLib, alignments, crInfo) {
		var metaInfo = {
			alignments: alignments,
			crInfo: crInfo,
			crList: [
				crInfo["0"],	crInfo["1/8"],	crInfo["1/4"],	crInfo["1/2"],
				crInfo["1"],	crInfo["2"],	crInfo["3"],	crInfo["4"],
				crInfo["5"],	crInfo["6"],	crInfo["7"],	crInfo["8"],
				crInfo["9"],	crInfo["10"],	crInfo["11"],	crInfo["12"],
				crInfo["13"],	crInfo["14"],	crInfo["15"],	crInfo["16"],
				crInfo["17"],	crInfo["18"],	crInfo["19"],	crInfo["20"],
				crInfo["21"],	crInfo["22"],	crInfo["23"],	crInfo["24"],
				crInfo["25"],	crInfo["26"],	crInfo["27"],	crInfo["28"],
				crInfo["29"],	crInfo["30"],
			],
			environments: [
				"aquatic",
				"arctic",
				"cave",
				"coast",
				"desert",
				"dungeon",
				"forest",
				"grassland",
				"mountain",
				"planar",
				"ruins",
				"swamp",
				"underground",
				"urban",
			],
			tags: miscLib.tags,
			sizes: [
				"Tiny",
				"Small",
				"Medium",
				"Large",
				"Huge",
				"Gargantuan",
			],
			types: [
				"Aberration",
				"Beast",
				"Celestial",
				"Construct",
				"Dragon",
				"Elemental",
				"Fey",
				"Fiend",
				"Giant",
				"Humanoid",
				"Monstrosity",
				"Ooze",
				"Plant",
				"Undead",
			],
		};

		return metaInfo;
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory('misc', MiscService);

	function MiscService() {

		var crs = [],
			sourceFilters = {},
			sources = [],
			shortNames = {},
			tags = {},
			i;

		crs.push({ text: "0", value: 0 });
		crs.push({ text: "1/8", value: 0.125 });
		crs.push({ text: "1/4", value: 0.25 });
		crs.push({ text: "1/2", value: 0.5 });
		for ( i = 1; i < 25; i++ ) {
			crs.push({ text: i.toString(), value: i });
		}

		var service = {		
			getMultiplier: getMultiplier,
			sourceFilters: sourceFilters,
			sources: sources,
			shortNames: shortNames,
			tags: tags,
		};

		return service;

		//////

		function getMultiplier(playerCount, monsterCount) {
			var multiplierCategory,
				multipliers = [
					0.5,
					1,
					1.5,
					2,
					2.5,
					3,
					4,
					5,
				];

			if ( monsterCount === 0 ) {
				return 0;
			} else if ( monsterCount === 1 ) {
				multiplierCategory = 1;
			} else if ( monsterCount === 2 ) {
				multiplierCategory = 2;
			} else if ( monsterCount < 7 ) {
				multiplierCategory = 3;
			} else if ( monsterCount < 11 ) {
				multiplierCategory = 4;
			} else if ( monsterCount < 15 ) {
				multiplierCategory = 5;
			} else {
				multiplierCategory = 6;
			}

			if ( playerCount < 3 ) {
				// Increase multiplier for parties of one and two
				multiplierCategory++;
			} else if ( playerCount > 5 ) {
				// Decrease multiplier for parties of six through eight
				multiplierCategory--;
			}

			return multipliers[multiplierCategory];
		}
	}
})();

(function() {
	"use strict";

	angular.module("app").factory("monsters", Monsters);

	// https://docs.google.com/spreadsheets/d/19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I/edit
	var masterSheetId = "19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I";

	Monsters.$inject = [
		"googleSheetLoader",
		"misc",
		"monsterFactory",
	];

	function Monsters(
		googleSheetLoader,
		miscLib,
		monsterFactory
	) {
		var registedSources = {};
		var all = [];
		var byId = {};
		var byCr = {};

		googleSheetLoader(masterSheetId)
		.then(function (sheets) {
			sheets.Monsters.forEach(function (monsterData) {
				var monster = new monsterFactory.Monster(monsterData);

				all.push(monster);
				byId[monster.id] = monster;

				if ( ! monster.special ) {
					if ( ! byCr[monster.cr.string] ) {
						byCr[monster.cr.string] = [];
					}

					byCr[monster.cr.string].push(monster);
				}
			});

			sheets.Sources.forEach(function (sourceData) {
				var name = sourceData.name;
				var shortName = sourceData.shortname;
				var initialState = !!(sourceData.defaultselected || "").match(/yes/i);

				if ( registedSources[name] ) {
					return;
				}

				registedSources[name] = true;

				miscLib.sources.push(name);
				miscLib.sourceFilters[name] = initialState;
				miscLib.shortNames[name] = shortName;
			});

			all.sort(function (a, b) {
				return (a.name > b.name) ? 1 : -1;
			});
		});

		return {
			all: all,
			byCr: byCr,
			byId: byId,
			check: monsterFactory.checkMonster,
		};
	}
})();

(function() {
'use strict';

  angular
    .module('app')
    .factory('partyInfo', PartyInfo);

  PartyInfo.inject = ['$log', 'playerLevels', 'store'];

  function PartyInfo($log, playerLevels, store) {
    var service = {
      // Variables
			partyLevels: [
				{
					level: playerLevels[1],
					playerCount: 4
				}
			],

      // Methods
      initialize: initialize,
			freeze: freeze,
			thaw: thaw,

      // Properties
			get totalPlayerCount() {
				return _.sum(_.map(service.partyLevels, function (pl) { return pl.playerCount; }));
			},

			get totalPartyExpLevels() {
				var result = _.reduce(service.partyLevels, function(accum, curLevel, key) {
					var curExpLevels = getExpLevels(curLevel);

					return {
							easy: accum.easy + curExpLevels.easy,
							medium: accum.medium + curExpLevels.medium,
							hard: accum.hard + curExpLevels.hard,
							deadly: accum.deadly + curExpLevels.deadly
					};
					
					return accum;
				}, { easy: 0, medium: 0, hard: 0, deadly: 0});
				return result;
			}
    };
    
    return service;

		function getExpLevels(partyLevel) {
				return {
					easy: partyLevel.playerCount * partyLevel.level.easy,
					medium: partyLevel.playerCount * partyLevel.level.medium,
					hard: partyLevel.playerCount * partyLevel.level.hard,
					deadly: partyLevel.playerCount * partyLevel.level.deadly
				};
		}

    ////////////////
    function initialize() {
			thaw();
		}

    function freeze() {
			var o =_.map(service.partyLevels, function (pl) {
				return {
					level: pl.level.level,
					playerCount: pl.playerCount
				};
			});

			$log.log("Freezing party info", o);

			store.set("5em-party-info", o);
		}

		function thaw() {
			$log.log('Thawing party info');

			if (store.hasKey('5em-party-info')) {
				return store.get("5em-party-info").then(loadPartyInfoFromStore);
			} else {
				return store.get("5em-encounter").then(loadFromEncounterStoreAndConvert);
			}
		}

		/*
			Token: 5em-party-info
			Type: Array
			Example:
				[
					{
						level: 4,
						playerCount: 4
					}
				]
		*/
		function loadPartyInfoFromStore(frozenDataArray) {
			if ( !frozenDataArray ) {
				return;
			}

			service.partyLevels = [];

			_.forEach(frozenDataArray, function(frozenData) {
				$log.log('Load party level (' + frozenData.level + ') and player count (' + frozenData.playerCount + ') from the store');
				service.partyLevels.push({
					level: playerLevels[frozenData.level],
					playerCount: frozenData.playerCount
				});
			});
		}

		function loadFromEncounterStoreAndConvert(frozenData) {
			if ( !frozenData ) {
				return;
			}

			$log.log('(Encounter) Load party level (' + frozenData.partyLevel + ') and player count (' + frozenData.playerCount + ') from the store');
			service.partyLevels = [{
				level: playerLevels[frozenData.partyLevel],
				playerCount: frozenData.playerCount
			}];

			$log.log("Removing old encounter store token and replacing it with party info token");

			var newFrozenData = [
				{
					level: frozenData.partyLevel,
					playerCount: frozenData.playerCount
				}
			];
			store.set("5em-party-info", newFrozenData);

			if (store.hasKey("5em-current-encounter")) {
				store.remove("5em-encounter");
			}
		}
  }
})();
(function () {
	"use strict";

	angular.module("app")
		.factory("players", PlayersService);

	PlayersService.$inject = ["$rootScope", "$log", "store"];

	function PlayersService($rootScope, $log, store) {
		var players = {
				selectedParty: null,
				selectParty: function (party) {
					players.selectedParty = party;
				},
				setDamage: function (name, damage) {
					for ( var i = 0; i < players.selectedParty.length; i++ ) {
						if ( players.selectedParty[i].name === name ) {
							players.selectedParty[i].damage = damage;
							rawDirty = true;
							freeze();
							return;
						}
					}
				},
				initialize: initialize
			},
			rawDirty = true,
			rawText = "",
			partiesDirty,
			parties = [];

		window.players = players;

		Object.defineProperty(players, "raw", {
			get: function () {
				if ( rawDirty ) {
					compileRaw();
				}

				return rawText;
			},
			set: function (value) {
				rawText = value;
				partiesDirty = true;
			},
		});

		Object.defineProperty(players, "parties", {
			get: function () {

				if ( partiesDirty ) {
					compileParties();
				}

				return parties;
			}
		});

		function compileParties() {
			var i, j, m;
			partiesDirty = false;
			parties = rawText.split(/\n\n+/);

			for ( i = 0; i < parties.length; i++ ) {
				parties[i] = parties[i].split("\n");
				for ( j = 0; j < parties[i].length; j++ ) {
					// 1: Name
					// 2: Initiative mod
					// 3: Remaining HP (optional)
					// 4: Max HP
					//                       1       2               3              4
					m = parties[i][j].match(/(.*?)\s+([-+]?\d+)\s+(?:(\d+)\s*\/\s*)?(\d+)\s*$/);

					if ( m ) {
						parties[i][j] = {
							name: m[1],
							initiativeMod: parseInt(m[2]),
							damage: (m[3]) ? m[4] - m[3] : 0,
							hp: parseInt(m[4]),
						};
					} else {
						$log.warn("Can't match:", parties[i][j]);
					}
				}

			}

			rawDirty = true;
			freeze();
		}

		function compileRaw() {
			var i, j, newRaw = [], p;
			rawDirty = false;
			
			for ( i = 0; i < players.parties.length; i++ ) {
				newRaw[i] = [];

				for ( j = 0; j < players.parties[i].length; j++ ) {
					p = players.parties[i][j];
					newRaw[i].push([
						p.name,
						(p.initiativeMod >= 0) ? "+" + p.initiativeMod : p.initiativeMod,
						p.hp - p.damage,
						"/",
						p.hp,
					].join(" "));
				}

				newRaw[i] = newRaw[i].join("\n");
			}

			rawText = newRaw.join("\n\n");
		}

		function initialize() {
			thaw();
		}

		function freeze() {
			$log.log('Freeze players');
			store.set("5em-players", parties);
		}

		function thaw() {
			$log.log('Thaw players');
			store.get("5em-players").then(function (frozen) {
				if (frozen) {
					parties = frozen;
					partiesDirty = false;
					rawDirty = true;
				}
			});
		}

		return players;
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("randomEncounter", RandomEncounterService);

	RandomEncounterService.$inject = ["monsterFactory", "misc", "shuffle", "metaInfo", "monsters"];

	function RandomEncounterService(monsterLib, miscLib, shuffle, metaInfo, monsters) {
		var randomEncounter = {
			//
			//	getRandomEncounter
			//		playerCount: Count of total number of players in party
			//		targetTotalExp: The experience target value. Takes into account player count, player level, and target difficulty already.
			//		filters: Any filters that should be applied when making the encounter
			//
			getRandomEncounter: function (playerCount, targetTotalExp, filters) {
				var fudgeFactor = 1.1, // The algorithm is conservative in spending exp, so this tries to get it closer to the actual medium value
					baseExpBudget = targetTotalExp * fudgeFactor,
					encounterTemplate = getEncounterTemplate(),
					multiplier = miscLib.getMultiplier(playerCount, encounterTemplate.total),
					availableExp = baseExpBudget / multiplier,
					monster,
					monsterGroups = [],
					currentGroup, targetExp;

				while ( encounterTemplate.groups[0] ) {
					// Exp should be shared as equally as possible between groups
					targetExp = availableExp / encounterTemplate.groups.length;
					currentGroup = encounterTemplate.groups.shift();

					// We need to find a monster who, in the correct number, is close to the target exp
					targetExp /= currentGroup;

					monster = getBestMonster(targetExp, filters);

					monsterGroups.push({
						monster: monster,
						qty: currentGroup,
					});

					// Finally, subtract the actual exp value
					availableExp -= currentGroup * monster.cr.exp;
				}

				return monsterGroups;
			},
			getShuffledMonsterList: function (crString) {
				var list = monsters.byCr[crString].slice(0);

				return shuffle(list);
			},
		};

		return randomEncounter;

		function getEncounterTemplate() {
			var templates = [
					[ 1 ],
					[ 1, 2 ],
					[ 1, 5 ],
					[ 1, 1, 1 ],
					[ 1, 1, 2 ],
					[ 1, 2, 3 ],
					[ 2, 2 ],
					[ 2, 4 ],
					[ 8 ],
				],
				groups = JSON.parse(JSON.stringify(templates[Math.floor(Math.random() * templates.length)])),
				total = groups.reduce(function (a, b) { return a+b; });

			// Silly hack to clone object
			return {
				total: total,
				groups: groups,
			};
		}

		function getBestMonster(targetExp, filters) {
			var bestBelow = 0,
				bestAbove,
				crIndex,
				currentIndex,
				step = -1,
				monsterList,
				i;

			for ( i = 1; i < metaInfo.crList.length; i++ ) {
				if ( metaInfo.crList[i].exp < targetExp ) {
					bestBelow = i;
				} else {
					bestAbove = i;
					break;
				}
			}

			if ( (targetExp - metaInfo.crList[bestBelow].exp) < (metaInfo.crList[bestAbove].exp - targetExp) ) {
				crIndex = bestBelow;
			} else {
				crIndex = bestAbove;
			}

			currentIndex = crIndex;

			monsterList = randomEncounter.getShuffledMonsterList(metaInfo.crList[crIndex].string);

			while ( true ) {
				if ( monsterLib.checkMonster(monsterList[0], filters, { skipCrCheck: true, nonUnique: true }) ) {
					return monsterList[0];
				} else {
					monsterList.shift();
				}

				// If we run through all the monsters from this level, check a different level
				if ( monsterList.length === 0 ) {
					// there were no monsters found lower than target exp, so we have to start checking higher
					if ( currentIndex === 0 ) {
						// Reset currentIndex
						currentIndex = crIndex;
						// Start looking up instead of down
						step = 1;
					}

					currentIndex += step;
					monsterList = randomEncounter.getShuffledMonsterList(metaInfo.crList[currentIndex].string);
				}
			}
		}
	}
})();
(function() {
	"use strict";

	angular.module("app").factory("googleSheetLoader", googleSheetService);

	googleSheetService.$inject = ["$q"];
	function googleSheetService($q) {
		// Loads a published google sheet by ID. Example usage:
		// googleSheetService(sheetId).then(function (data) {})

		// data will be an object. The keys of this object are names of sheets from the workbook
		// (e.g. "Sheet1"). The value for each of those keys is an array of objects. Each of those
		// objects is one row from that sheet, with keys based on the header row from that sheet.

		// Example:
		// {
		// 	"Sheet1": [
		// 		{ "name": "Ancient Red Dragon", "alignment": "Chaotic evil" }
		// 	]
		// }

		// Two important things to note:

		// 1: The column names from the header row will have illegal characters like spaces removed,
		// and will be entirely lowercased

		// 2: Empty cells will be omitted from the individual objects lacking entries for those
		// cells
		return loadGS.bind(null, $q);
	}

	// Modified version of my gs-loader script to use $q and output tabular arrays of objects
	// instead of lists
	var loadGS = (function () {

		var jsonpcount = 0;
		var sheets = {};

		// Get AJAX using jsonp
		function getSheetsJsonp($q, url) {
			var callbackName = "__jsonpcallback" + jsonpcount++;

			var deferred = $q.defer();

			window[callbackName] = function jsonpCallback(data) {
				deferred.resolve(data.feed.entry);
				delete window[callbackName];
			};

			var script = document.createElement("script");
			script.src = url + "?alt=json-in-script&callback=" + callbackName;
			script.addEventListener("load", function () {
				this.parentNode.removeChild(this);
			}, false);

			document.head.appendChild(script);

			return deferred.promise;
		}

		function parseLine(ws, data) {
			data.forEach(function (line) {
				var parsedObject = {};
				Object.keys(line).forEach(function (key) {
					var val = line[key].$t;

					if ( !val ) { return; }

					// The fields that contain the cell values are named "gsx$colName"
					var match = key.match(/^gsx\$(.+)/);

					if ( !match ) { return; }

					var col = match[1];

					parsedObject[col] = val;

				});
				ws.push(parsedObject);
			});
		}

		function getWorksheets($q, id) {
			var url = "https://spreadsheets.google.com/feeds/worksheets/" + id + "/public/full";
			var worksheetPromises = [];
			var worksheets = {};

			// Step 1: Get a list of all the worksheets in the spreadsheet
			return getSheetsJsonp($q, url).then(function (data) {
				data.forEach(function (worksheet) {
					var name = worksheet.title.$t;
					var ws = worksheets[name] = [];

					// Step 2: For each worksheet, parse its listfeed
					worksheet.link.some(function (link) {
						if ( link.rel.match(/listfeed/) ) {
							worksheetPromises.push(
								getSheetsJsonp($q, link.href)
								.then(parseLine.bind(null, ws))
							);
							return true;
						}
					});
				});

				return $q.all(worksheetPromises).then(function () {
					return worksheets;
				});
			});
		}

		// Cache results for each id
		function load($q, id) {
			sheets[id] = sheets[id] || getWorksheets($q, id);

			return sheets[id];
		}

		return load;
	}());
})();

(function() {
	"use strict";

	angular.module("app")
		.factory('sources', SourcesService);

	SourcesService.$inject = ['misc'];

	function SourcesService(miscLib){
		return {
			all: miscLib.sources,
			filters: miscLib.sourceFilters,
			shortNames: miscLib.shortNames
		};
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("store", StoreService);

	StoreService.$inject = ['$q', '$log', 'localStorageService'];

	function StoreService($q, $log, localStorageService) {
		var store = {
			get: function (key) {
				return $q(function(resolve, reject) {
					var data;

					try {
						data = localStorageService.get(key);
						resolve(data);
					} catch (ex) {
						$log.warn("Unable to parse stored value for " + key);
						data = undefined;
						reject("Unable to parse stored value for " + key);
					}
				});
			},
			set: function (key, data) {
				localStorageService.set(key, data);
			},
			remove: function (key) {
				return localStorageService.remove(key);
			},
			hasKey: function (key) {
				return _.indexOf(localStorageService.keys(), key) >= 0;
			}
		};

		return store;
	};
})();

(function() {
	'use strict';

	angular.module("app")
		.controller('TestController', TestController);

	TestController.$inject = ['misc', 'AppVersion', 'combatConstants',
		'sources',
		'store',
		'shuffle',
		'players',
		'library',
		'actionQueue',
		'crInfo',
		'alignments',
		'monsterFactory',
		'metaInfo',
		'monsterData',
		'randomEncounter',
		'encounter',
		'filters'
	];

	function TestController(miscLib, appVersion) {
		var vm = this;
		vm.appVersion = appVersion;
	}
})();
(function() {
  'use strict';

  angular
    .module('app')
    .factory('logger', logger);

  logger.$inject = ['$log'];

  /* @ngInject */
  function logger($log) {
    var service = {
      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data, title) {
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      $log.warn('Warning: ' + message, data);
    }
  }
} ());

/* Help configure the state-base ui.router */
(function() {
  'use strict';

  angular
    .module('app')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
  /* @ngInject */
  function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
      /* jshint validthis:true */
      this.$get = RouterHelper;

      //$locationProvider.html5Mode(true);

      RouterHelper.$inject = ['$state'];

      /* @ngInject */
      function RouterHelper($state) {
          var hasOtherwise = false;

          var service = {
              configureStates: configureStates,
              getStates: getStates
          };

          return service;

          ///////////////

          function configureStates(states, otherwisePath) {
              states.forEach(function(state) {
                  $stateProvider.state(state.state, state.config);
              });
              if (otherwisePath && !hasOtherwise) {
                  hasOtherwise = true;
                  $urlRouterProvider.otherwise(otherwisePath);
              }
          }

          function getStates() { return $state.get(); }
      }
  }
})();

(function () {
	"use strict";

	angular.module("app")
		.factory('shuffle', Shuffle);

	// via http://bost.ocks.org/mike/shuffle/

	function Shuffle() {
		return function (array) {
			var m = array.length, t, i;

			while (m) {
				i = Math.floor(Math.random() * m--);

				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		};
	}
})();

angular.module('app').run(['$templateCache', function($templateCache) {$templateCache.put('app/test.html','<div class=container-fluid role=main>This is version {{vm.appVersion}}</div>');
$templateCache.put('app/about/about.html','<div class=container><div class="about--logo pull-right"><img src=images/logo.png class=img-responsive alt=Logo></div><h2>Contact us if you have questions or issues</h2><h3>Register Bugs, Issues, and Feature Reqeusts on our Idea Informer</h3><a href="http://kobold.idea.informer.com/" target=_blank>Kobold Fight Club Feedback</a><h3>Via Reddit</h3><a href=http://www.reddit.com/r/asmor target=_blank>Asmor\'s Official Subreddit</a><h3>Contact the Owners Directly</h3><dl class=dl-horizontal><dt>Site Owner:</dt><dd>Ian Toltz</dd><dd><a href=mailto:itoltz@gmail.com>itoltz@gmail.com</a><dd><a href=http://reddit.com/u/Asmor target=_blank>/u/Asmor</a></dd></dd></dl><dl class=dl-horizontal><dt>Site Contributor:</dt><dd>Joe Barzilai</dd><dd><a href=mailto:jabber3+kobold@gmail.com>jabber3@gmail.com</a><dd><a href=http://reddit.com/u/jabber3 target=_blank>/u/jabber3</a></dd></dd></dl><dl class=dl-horizontal><dt>Logo by:</dt><dd>Jin The Blue</dd></dl><h3>Want to Contribute?</h3><p>Join us on the <a href=https://github.com/Asmor/5e-monsters>Kobold Github</a></p><p class="about--disclaimer lead">Kobold Fight Club is not associated with Wizards of the Coast.</p></div>');
$templateCache.put('app/battle-setup/battle-setup.html','<div class=combat-setup-controls><button class="btn btn-danger btn-lg" ui-sref=battle-tracker>Fight!</button> <button class="btn btn-lg combat-setup-controls--imp-init-button" ng-click=vm.launchImpInit()>Run in Improved Initiative</button></div><combatant-setup ng-repeat="combatant in vm.combat.combatants" combatant=combatant></combatant-setup>');
$templateCache.put('app/battle-setup/combatant-setup.html','<div class=combatant-setup ng-class="\'combatant-setup__\' + vm.combatant.type"><span class=combatant-setup--name><input class="combatant-setup--input combatant-setup--input__name" ng-model=vm.combatant.name></span> <span class=combatant-setup--initative-mod><span ng-if=!vm.combatant.fixedInitiative>Initiative Mod: <span ng-if="vm.combatant.initiativeMod >= 0">+</span>{{ vm.combatant.initiativeMod }}</span></span> <span class=combatant-setup--initative>Initiative: <span ng-if=!vm.combatant.fixedInitiative><number-input model=vm.combatant.initiative buttons="[-1, 1]"></number-input><button class="combatant-setup--button combatant-setup--button__roll" ng-click=vm.combat.rollInitiative(vm.combatant) ng-if=!vm.combatant.initiativeRolled>Roll</button></span> <span ng-if=vm.combatant.fixedInitiative>{{ vm.combatant.initiative }}</span></span> <span class=combatant-setup--hp><span ng-if=!vm.combatant.noHp>HP:<number-input model=vm.combatant.hp buttons="[-5, -1, 1, +5]" ng-if="vm.combatant.type != \'player\'"></number-input><span ng-if="vm.combatant.type == \'player\'">{{ vm.combatant.hp - vm.combatant.damage }} / {{ vm.combatant.hp }}</span></span></span></div>');
$templateCache.put('app/battle-tracker/battle-tracker.html','<div class=combat-controls><number-input model=vm.combat.delta buttons="[-10, -5, -1, 1, 5, 10]" non-negative=true></number-input><button class=combat-controls--next-turn ng-click=vm.combat.nextTurn()>Next turn</button></div><combatant ng-repeat="combatant in vm.combat.combatants" combatant=combatant></combatant>');
$templateCache.put('app/battle-tracker/combatant.html','<div class="combatant combatant__{{ vm.combatant.type }}" ng-class="{ \'combatant__active\': vm.combatant.active }"><span class=combatant--name>{{ vm.combatant.name }}</span> <span class=combatant--initiative-label>Initiative:</span> <span class=combatant--initiative>{{ vm.combatant.initiative }}</span> <span class=combatant--hp-label><span ng-if=!vm.combatant.noHp>HP:</span></span> <span class=combatant--hp><span ng-if=!vm.combatant.noHp>{{ vm.combatant.hp - vm.combatant.damage }} / {{ vm.combatant.hp }}</span></span> <span class=combatant--apply><span ng-show="vm.combat.delta && !vm.combatant.noHp"><button class=combatant--apply-button ng-click=vm.combat.applyDelta(vm.combatant)>Damage {{ vm.combat.delta }}</button> <button class=combatant--apply-button ng-click="vm.combat.applyDelta(vm.combatant, -1)">Heal {{ vm.combat.delta }}</button></span></span></div>');
$templateCache.put('app/common/difficulty-legend.html','<h3 ng-if=vm.showHeader>Legend</h3><ul><li class=difficulty-legend__deadly>Deadly: One of these is a deadly challenge</li><li class=difficulty-legend__hard>Hard: One of these is a hard challenge</li><li class=difficulty-legend__medium>Medium: One of these is a medium challenge</li><li class=difficulty-legend__easy>Easy: One of these is an easy challenge</li><li class=difficulty-legend__pair>Pair: Two of these is a medium challenge</li><li class=difficulty-legend__group>Group: Four of these is a medium challenge</li><li class=difficulty-legend__trivial>Trivial: Eight or more of these is a medium challenge</li></ul>');
$templateCache.put('app/common/number-input.html','<span class=number-input><button class="number-input--button number-input--button__negative" ng-class="{\'number-input--button__hidden\' : vm.hideNegative()}" ng-repeat="mod in vm.mods | negative" ng-click=vm.modify(mod)>{{ mod }}</button> <span class=number-input--value>{{ vm.value }}</span> <button class="number-input--button number-input--button__positive" ng-repeat="mod in vm.mods | positive" ng-click=vm.modify(mod)>+{{ mod }}</button></span>');
$templateCache.put('app/encounter-builder/current-encounter.html','<h2>Encounter Info<div class="btn-group pull-right"><button class="btn btn-info" ng-click=vm.generateRandom()>{{vm.randomButtonText()}}</button> <button type=button class="btn btn-info dropdown-toggle" data-toggle=dropdown aria-haspopup=true aria-expanded=false><span class=caret></span> <span class=sr-only>Toggle Dropdown</span></button><ul class=dropdown-menu><li><a href=# ng-click="vm.generateRandom(\'easy\')">Random Easy</a></li><li><a href=# ng-click="vm.generateRandom(\'medium\')">Random Medium</a></li><li><a href=# ng-click="vm.generateRandom(\'hard\')">Random Hard</a></li><li><a href=# ng-click="vm.generateRandom(\'deadly\')">Random Deadly</a></li></ul></div></h2><p class="current-encounter--empty bg-info text-muted" ng-if="vm.encounter.qty == 0">Create an encounter by clicking the Random encounter button or by adding monsters from the monsters table.</p><div class=current-encounter ng-class="{ \'current-encounter__shown\': vm.encounter.qty }"><div class=current-encounter--body><div class=current-encounter--table><div class=current-encounter--row ng-repeat="group in vm.encounter.groups | sortEncounter"><div class=current-encounter--monster-info><span class="current-encounter--monster-name text-capitalized">{{ group.monster.name }}</span><div><span class=current-encounter--monster-cr>CR: {{ group.monster.cr.string }}</span> <span class=current-encounter--monster-xp>XP: {{ group.monster.cr.exp | number}}</span><div class=current-encounter--monster-source ng-repeat="source in group.monster.sources" ng-show=vm.filters.source[source.name] title="{{source.name}} p.{{source.page}}">{{ source.name }} <span ng-if=source.page>p.{{ source.page }}</span> <span ng-if=source.url><a target=_blank href="{{ source.url }}">[Link]</a></span></div></div></div><div class=current-encounter--monster-qty-col><button ng-click="vm.encounter.randomize(group.monster, vm.filters)" class="btn btn-default" title="Randomize Monster"><i class="fa fa-random"></i></button> <input class="current-encounter--monster-qty form-control input-lg" type=number ng-model=group.qty><div class=current-encounter--monster-qty-btns><button ng-click=vm.encounter.add(group.monster) class="btn btn-xs btn-success"><i class="fa fa-plus"></i></button> <button ng-click=vm.encounter.remove(group.monster) class="btn btn-xs btn-danger"><i class="fa fa-minus"></i></button></div></div></div></div><div class=current-encounter--totals><div class=current-encounter--totals-difficulty>Difficulty: {{ vm.encounter.difficulty }}</div><div class=current-encounter--totals-xp><span>Total XP: {{ vm.encounter.exp | number }}</span> <span>Adjusted XP: {{ vm.encounter.adjustedExp | number }}</span></div></div><div class=current-encounter--btns><button class="btn btn-danger btn-new" ng-click=vm.encounter.reset()>New</button> <button class="btn btn-primary" ui-sref=encounter-manager ng-if=!vm.encounter.reference>Save</button></div></div></div>');
$templateCache.put('app/encounter-builder/encounter-builder.html','<div class="encounter-builder container-fluid" role=main><div class=row><div class=col-md-4><group-info></group-info><div class=encounter-builder--current-encounter-container><div class=encounter-builder--current-encounter-slider ng-class="{\'encounter-builder--current-encounter-slider__shown\': encounterShown }"><div class=encounter-builder--encounter-info-bar ng-click="encounterShown = !encounterShown"><i class="fa encounter-builder--toggle-arrow" ng-class="{ \'fa-toggle-up\': !encounterShown, \'fa-toggle-down\': encounterShown }" aria-hidden=true></i><div class=encounter-builder--encounter-info-text><span ng-if=vm.encounter.exp>{{ vm.getMonsterQtyString() }}, {{ vm.encounter.exp }} exp ({{ vm.encounter.difficulty }})</span> <span ng-if=!vm.encounter.exp><span ng-if=encounterShown>Browse monsters</span> <span ng-if=!encounterShown>Manage encounter</span></span></div></div><div class=encounter-builder--current-encounter><current-encounter filters=vm.filters></current-encounter></div></div></div><div class="difficulty-legend hidden-xs hidden-sm"><button class="btn btn-warning difficulty-legend-button" type=button data-toggle=collapse data-target=#legend-collapse>Legend <i class="fa fa-angle-double-up" aria-hidden=true></i></button><div id=legend-collapse class="difficulty-legend-popout collapse" aria-expanded=false aria-controls=legend-collapse><difficulty-legend></difficulty-legend></div></div></div><div class=col-md-8><search-controls filters=vm.filters></search-controls><monster-table filters=vm.filters></monster-table><div class="difficulty-legend-sm visible-xs visible-sm"><difficulty-legend show-header=true></difficulty-legend></div></div></div></div>');
$templateCache.put('app/encounter-builder/group-info.html','<div class=group-info><div class=group-info--input><h2 class=group-info--header>Group Info</h2><div class="group-info--party-level-row row" ng-repeat="partyLevel in vm.partyInfo.partyLevels"><party-level-selector party-level=partyLevel first=$first></party-level-selector></div><button class="btn btn-xs btn-info group-info--add-level" title="Add Another Party Level" ng-click=vm.addPartyLevel()><i class="fa fa-plus"></i> Add Another Level</button></div><ul class="group-info--guidelines list-unstyled"><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Easy\'}"><span>Easy:</span> <span class=group-info--guidelines-values>{{ vm.partyInfo.totalPartyExpLevels.easy | number }} exp</span></li><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Medium\'}"><span>Medium:</span> <span class=group-info--guidelines-values>{{ vm.partyInfo.totalPartyExpLevels.medium | number }} exp</span></li><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Hard\'}"><span>Hard:</span> <span class=group-info--guidelines-values>{{ vm.partyInfo.totalPartyExpLevels.hard | number }} exp</span></li><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Deadly\'}"><span>Deadly:</span> <span class=group-info--guidelines-values>{{ vm.partyInfo.totalPartyExpLevels.deadly | number }} exp</span></li></ul></div>');
$templateCache.put('app/encounter-builder/monster-table.html','<div class="monster-table table-responsive"><table class="monster-table--table table table-bordered table-striped"><thead><tr><th class="monster-table--column monster-table--column__button"></th><th class="monster-table--column monster-table--column__sortable monster-table--column__name" ng-click="vm.filters.sort = \'name\'">Name</th><th class="monster-table--column monster-table--column__sortable monster-table--column__cr" ng-click="vm.filters.sort = \'cr\'">CR</th><th class="monster-table--column monster-table--column__sortable monster-table--column__size" ng-click="vm.filters.sort = \'size\'">Size</th><th class="monster-table--column monster-table--column__sortable monster-table--column__type" ng-click="vm.filters.sort = \'type\'">Type</th><th class="monster-table--column monster-table--column__sortable monster-table--column__alignment" ng-click="vm.filters.sort = \'alignment\'">Alignment</th><th class="monster-table--column monster-table--column__source">Source</th></tr></thead><tbody><tr dir-paginate="monster in vm.monsters | monstersFilter:vm.filters | itemsPerPage: vm.filters.pageSize" class=monster-table--row><td class=monster-table--button-cell><button ng-click=vm.encounter.add(monster) class="btn btn-sm btn-success"><i class="fa fa-plus"></i></button></td><td class=monster-table--name-cell><div class=monster-table--name>{{ monster.name }}</div><div ng-if=monster.section class=monster-table--section><span class=monster-table--label>Section:</span> {{ monster.section }}</div></td><td class=monster-table--cr-cell ng-class="\'monster-table--cr-cell__\' + vm.dangerZone(monster)"><span class=monster-table--cr-label>CR</span> {{ monster.cr.string }}</td><td class=monster-table--size-cell><span class=monster-table--label>Size:</span> {{ monster.size }}</td><td class=monster-table--type-cell><span class=monster-table--label>Type:</span> {{ monster.type }} <span ng-if=monster.tags class=monster-table--tags>({{ monster.tags.join(", ") }})</span></td><td class=monster-table--alignment-cell><span ng-if=monster.alignment><span class=monster-table--label>Alignment:</span> {{ monster.alignment.text }}</span></td><td class=monster-table--source-cell><span class=monster-table--label>Source(s):</span><div class=monster-table--sources ng-repeat="source in monster.sources" ng-show=vm.filters.source[source.name]><span class="monster-table--source-name monster-table--source-name__short" title="{{ source.name }}">{{ vm.sources.shortNames[source.name] }}</span> <span class="monster-table--source-name monster-table--source-name__long">{{ source.name }}</span> <span ng-if=source.page>p.{{ source.page }}</span> <span ng-if=source.url><a target=_blank href="{{ source.url }}">[Link]</a></span></div></td></tr></tbody></table></div><div class=pagination-container><dir-pagination-controls></dir-pagination-controls></div>');
$templateCache.put('app/encounter-builder/party-level-selector.html','<div class=group-info--input-section><label ng-if=vm.first>Players:</label><select ng-model=vm.partyLevel.playerCount ng-options="count for count in [1,2,3,4,5,6,7,8,9,10,11,12]" ng-change=vm.save()></select></div><div class=group-info--input-section><label ng-if=vm.first>Level:</label><select ng-model=vm.partyLevel.level ng-options="level as level.level for level in vm.levels" ng-change=vm.save()></select></div><button ng-if=!vm.first class="btn btn-xs btn-danger group-info--remove-level" title="Add Different Party Level" ng-click=vm.removePartyLevel()><i class="fa fa-times"></i></button>');
$templateCache.put('app/encounter-builder/search.html','<div class=search><div class="search--search-form form-inline"><label class=sr-only>Search</label> <input class="form-control search-input" type=text ng-model=vm.filters.search placeholder=Search...><select class=form-control ng-model=vm.filters.size ng-options="size for size in vm.sizes"><option value>Any Size</option></select><select class=form-control ng-model=vm.filters.type ng-options="type for type in vm.types"><option value>Any Type</option></select><select class=form-control ng-model=vm.filters.minCr ng-options="cr.numeric as cr.string for cr in vm.crList"><option value>Min CR</option></select><select class=form-control ng-model=vm.filters.maxCr ng-options="cr.numeric as cr.string for cr in vm.crList"><option value>Max CR</option></select><select class=form-control ng-model=vm.filters.alignment ng-options="alignment as alignment.text for (key, alignment) in vm.alignments"><option value>Any Alignment</option></select><select class=form-control ng-model=vm.filters.environment ng-options="environment as environment for environment in vm.environments"><option value>Any Environment</option></select><button type=button class="btn btn-default" data-toggle=modal data-target=#sourcesModal>Set Sources</button></div><div class=search--reset><button class="btn btn-danger" ng-click=vm.resetFilters()>Reset Filters</button><div class=search--size-controls><label>Page size:</label><select class="form-control search--page-size" ng-model=vm.filters.pageSize ng-options="page for page in [10, 25, 50, 100, 250, 500, 1000]"></select></div></div><div class=modal id=sourcesModal tabindex=-1 role=dialog aria-labelledby=myModalLabel><div class=modal-dialog role=document><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h4 class=modal-title id=myModalLabel>Set Source Material</h4></div><div class=modal-body><div class=sources-modal--buttons><button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'all\')">Everything</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'core\')">Core Books</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'books\')">All Books</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'basic\')">Basic</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'thirdparty\')">Third Party</button></div><ul><li class=search--source ng-repeat="source in vm.sourceNames" ng-class="{ \'search--source__off\': !vm.filters.source[source] }"><label><input type=checkbox ng-model=vm.filters.source[source]> {{ source }}</label></li></ul></div><div class=modal-footer><button type=button class="btn btn-default" data-dismiss=modal>Close</button></div></div></div></div></div>');
$templateCache.put('app/encounter-manager/encounter-manager.html','<div class=encounter-manager><div class=encounter-manager--no-encounters ng-if="!vm.encounter.qty && !vm.library.encounters.length">You don\'t have any encounters saved. <button ui-sref=encounter-builder>Return to encounter builder</button></div><div class="encounter-manager-encounter encounter-manager-encounter__unsaved" ng-if="vm.encounter.qty && !vm.encounter.reference"><div class=encounter-manager-encounter--controls><input class=encounter-manager-encounter--name-input placeholder="{{ vm.newEncounter.placeholder }}" ng-model=vm.newEncounter.name> <button class=encounter-manager-encounter--save-button ng-click=vm.save()>Save current encounter</button></div><div class=encounter-manager-monster ng-repeat="(id, group) in vm.encounter.groups"><span ng-if="group.qty > 1">{{ group.qty }}x</span> {{ group.monster.name }}</div></div><div ng-repeat="storedEncounter in vm.library.encounters track by $index"><manager-row stored-encounter=storedEncounter></manager-row></div></div>');
$templateCache.put('app/encounter-manager/manager-row.html','<div class=encounter-manager-row><div class=encounter-manager-row--controls><div class=encounter-manager-row--name>{{ vm.storedEncounter.name }}</div><div class=encounter-manager-row--exp>Exp: {{ vm.calculateExp(vm.storedEncounter) }}</div><button class=encounter-manager-row--load-button ng-click=vm.load(vm.storedEncounter) ng-if="vm.encounter.reference != vm.storedEncounter">Choose</button> <button class=encounter-manager-row--remove-button ng-click=vm.remove(vm.storedEncounter)>Remove</button> <span class=encounter-manager-row--active ng-if="vm.encounter.reference == vm.storedEncounter">Active</span></div><div class=encounter-manager-monster ng-repeat="(id, qty) in vm.storedEncounter.groups"><span ng-if="qty > 1">{{ qty }}x</span> {{ vm.monsters.byId[id].name }}</div></div>');
$templateCache.put('app/navbar/navbar.html','<nav class="navbar navbar-inverse navbar-fixed-top"><div class=container-fluid><div class=navbar-header><button type=button class="navbar-toggle collapsed" data-toggle=collapse data-target=.navbar-collapse aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=#>Kobold Fight Club</a></div><div id=navbar class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=encounter-builder>Home</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=encounter-manager>Manage Encounters</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=players.manage>Manage Players</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=battle-setup>Run Encounters</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=about>About</a></li></ul></div></div></nav>');
$templateCache.put('app/players/edit.html','<div class=edit-players><p>One character per line. Blank line to separate different parties. Format: name initiative hp</p><textarea class="edit-players--text-input form-control" ng-model=vm.players.raw rows=10></textarea></div>');
$templateCache.put('app/players/manage.html','<div class=manage-players><div class=manage-players--party ng-repeat="party in vm.players.parties"><button class=manage-players--party-select-button ng-if="vm.players.selectedParty != party" ng-click=vm.select(party)>Select this party</button> <span class=manage-players--selected-party ng-if="vm.players.selectedParty == party">Selected</span><div class=manage-players--player ng-repeat="player in party"><span class=manage-players--player--name>{{ player.name }}</span> <span class=manage-players--player--init>Initiative: <span ng-if="player.initiativeMod >= 0">+</span>{{ player.initiativeMod }}</span> <span class=manage-players--player--hp>HP: {{ player.hp - player.damage }} / {{ player.hp }}</span></div></div></div>');
$templateCache.put('app/players/players.html','<div class=players-controls><button class="btn btn-primary" ui-sref=players.manage>Manage</button> <button class="btn btn-primary" ui-sref=players.edit>Edit</button></div><div ui-view></div>');}]);
