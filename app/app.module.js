(function () {
	/* global requirejs */
	"use strict";

	angular
		.module("app", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
		]);

	// requirejs.config({
	// 	// For cache-busting. Should be kept in sync with value in constants.js
	// 	urlArgs: "version=1",
	// });


	// require([
	// 	"app/encounter-builder/encounter-builder",
	// 	"app/encounter-manager/encounter-manager",
	// 	"app/battle-setup/battle-setup",
	// 	"app/battle-tracker/battle-tracker",
	// 	"app/players/players",
	// 	"app/common/common",
	// 	"app/filters",
	// 	"app/services/actionQueue",
	// 	"app/services/combat",
	// 	"app/services/encounter",
	// 	"app/services/library",
	// 	"app/services/metaInfo",
	// 	"app/services/monsters",
	// 	"app/services/players",
	// 	"app/services/randomencounter",
	// 	"app/services/sources",
	// 	"app/services/store",
	// 	"app/services/util",
	// ], function (
	// 	encounterBuilder,
	// 	encounterManager,
	// 	battleSetup,
	// 	battleTracker,
	// 	players,
	// 	common,
	// 	filters,
	// 	actionQueueService,
	// 	combatService,
	// 	encounterService,
	// 	libraryService,
	// 	metaInfoService,
	// 	monstersService,
	// 	playersService,
	// 	randomencounterService,
	// 	sourcesService,
	// 	storeService,
	// 	utilService
	// ) {
		
	// 		.config(function ($stateProvider, $urlRouterProvider) {
	// 			// Default
	// 			$urlRouterProvider.otherwise("/encounter-builder");

	// 			// Main menu page
	// 			$stateProvider.state("encounter-builder", {
	// 				url: "/encounter-builder",
	// 				templateUrl: "app/encounter-builder/encounter-builder.html",
	// 				controllerAs: "vm"
	// 				});
	// 			$stateProvider.state("encounter-manager", encounterManager);
	// 			$stateProvider.state("battle-setup", battleSetup);
	// 			$stateProvider.state("battle-tracker", battleTracker);
	// 			$stateProvider.state("players", players.main);
	// 			$stateProvider.state("players.edit", players.edit);
	// 			$stateProvider.state("players.manage", players.manage);
	// 		})
	// 		.directive("numberInput", common.numberInput)
	// 		.filter("monstersFilter", filters.monster)
	// 		.filter("negative", filters.negative)
	// 		.filter("positive", filters.positive)
	// 		.filter("sortEncounter", filters.sortEncounter)
	// 		.factory("actionQueue", actionQueueService)
	// 		.factory("combat", combatService)
	// 		.factory("encounter", encounterService)
	// 		.factory("library", libraryService)
	// 		.factory("metaInfo", metaInfoService)
	// 		.factory("monsters", monstersService)
	// 		.factory("players", playersService)
	// 		.factory("randomEncounter", randomencounterService)
	// 		.factory("sources", sourcesService)
	// 		.factory("store", storeService)
	// 		.factory("util", utilService)
	// 	;
	// });
})();