
describe('Encounter Service', function() {
  beforeEach(function() {
    bard.appModule('app');
    bard.inject(this, '$rootScope', 'encounter', 'store', '$q', 'playerLevels', 'randomEncounter');

    store.get = sinon.stub();
    randomEncounter.getRandomEncounter = sinon.stub();
  });
  
  describe('initialize', function() {
    it('should call store', function() {
      store.get.withArgs("5em-encounter").returns($q.when({}));
      encounter.initialize();
      expect(store.get).toHaveBeenCalledWith('5em-encounter');
    });

    it('should load info from store', function() {
      var level = {
          level: 4,
          easy: 1,
          medium: 2,
          hard: 3,
          deadly: 4
        };
      playerLevels[4] = level;
      var groupInfo = {
        partyLevel: 4,
        playerCount: 6
      };
      store.get.withArgs("5em-encounter").returns($q.when(groupInfo));
      encounter.initialize();
      $rootScope.$apply();
      expect(encounter.partyLevel).toBe(level);
      expect(encounter.partyLevel.level).toEqual(4);
      expect(encounter.playerCount).toEqual(6);
      expect(encounter.threat.easy).toEqual(12);
    });
  });

  describe('adjustedExp', function() {
    
    it('should exist', function() {
      expect(encounter.adjustedExp).toBeDefined();
    });
    
    it('should return multiple', function() {
      encounter.qty = 1;
      encounter.exp = 100;
      expect(encounter.adjustedExp).toEqual(100);
    });
  });
  
  describe('difficulty', function() {
    
    beforeEach(function() {
      encounter.playerCount = 4;
      encounter.partyLevel = {
        easy: 101,
        medium: 201,
        hard: 301,
        deadly: 401
      };
    });
      
    it('should return false if the adjusted exp is zero', function() {
      expect(encounter.difficulty).toEqual(false);
    });
    
    [
      {exp: 100, result: ""},
      {exp: 200, result: "Easy"},
      {exp: 300, result: "Medium"},
      {exp: 400, result: "Hard"},
      {exp: 500, result: "Deadly"}
    ].forEach(function(run) {
      it('should be ' + run.result, function() {
        encounter.qty = 1;
        // Multiply by player count because if we change the qty it will change the multiplier
        encounter.exp = run.exp * encounter.playerCount;
        
        expect(encounter.difficulty).toEqual(run.result);
      });
    });
  });

  describe('generateRandom', function() {
    it('should add random monsters to encounter', function() {
      var targetDifficulty = 'easy',
        targetExp = 400,
        filters = {};
      
      encounter.playerCount = 4;
      encounter.partyLevel = {
        "easy": targetExp
      };
      
      var monsterA = { 
        id: "golem",
        cr: {
          exp: 100
        }
      },
      monsterB = {
        id: "goblin",
        cr: {
          exp: 50
        }
      }
      var monsters = [
        { monster: monsterA, qty: 1 },
        { monster: monsterB, qty: 2}
      ];
      randomEncounter.getRandomEncounter.withArgs(encounter.playerCount, targetExp, filters).returns(monsters);

      encounter.generateRandom(filters, targetDifficulty);

      expect(randomEncounter.getRandomEncounter).toHaveBeenCalled();
      var expectedGroups = {
        "golem": {
          qty: 1,
          monster: monsterA
        },
        "goblin": {
          qty: 2,
          monster: monsterB
        }
      };
      expect(encounter.groups).toEqual(expectedGroups);
      expect(encounter.qty).toEqual(3);
      expect(encounter.exp).toEqual(200);
    });

    it('should default to medium difficulty', function() {
       var targetExp = 400,
        filters = {};
      
      encounter.playerCount = 4;
      encounter.partyLevel = {
        "medium": targetExp
      };
      
      randomEncounter.getRandomEncounter.withArgs(encounter.playerCount, targetExp, filters).returns([]);

      encounter.generateRandom(filters);

      expect(randomEncounter.getRandomEncounter).toHaveBeenCalledWith(encounter.playerCount, targetExp, filters);
    });
  });

  describe('add', function() {
    beforeEach(function() {
      encounter.reset();
    });

    it('should default qty to 1 if none provided ', function() {
      var monster = {
        id: "ELEMENTAL",
        cr: {
          exp: 500
        }
      };

      encounter.add(monster);

      var expectedGroups = {
        "ELEMENTAL": {
          qty: 1,
          monster: monster
        }
      };

      expect(encounter.groups).toEqual(expectedGroups);
      expect(encounter.qty).toEqual(1);
      expect(encounter.exp).toEqual(500);
      expect(encounter.reference).toBeNull();
    });

    it('should add monster to groups and update all cumulative properties', function() {
      var monster = {
        id: "ELEMENTAL",
        cr: {
          exp: 500
        }
      };

      encounter.add(monster, 2);

      var expectedGroups = {
        "ELEMENTAL": {
          qty: 2,
          monster: monster
        }
      };

      expect(encounter.groups).toEqual(expectedGroups);
      expect(encounter.qty).toEqual(2);
      expect(encounter.exp).toEqual(1000);
      expect(encounter.reference).toBeNull();
    });
  });
    
});
  