const { $gameTemp } = require("./__mocks__/$gameTemp.js");
const { PluginManager } = require("./__mocks__/PluginManager.js");
require("./__mocks__/$gameTemp.js")
require("./__mocks__/$gameVariables.js")

/**
 * Remove and reimport the plugin and the code that it alters so that the plugin can accept changes in the passed parameters.
 * Acts similar to the plugin manager when it loads the plugin in RPG Maker.
 */
function setupPlugin() {
    jest.resetModules();
    require("./__mocks__/Game_Battler.js");
    require("./CustomDeaths.js");
}

const afterDeathEvent = 1;
const beforeDeathEvent = 2;
const killedEntityType = 1;
const killedIdVariable = 2;

function testNonLethalDamage() {
    const realSetHp = jest.fn();
    const battler = new Game_Battler(realSetHp);
    battler.setHp(35);
    expect(realSetHp).toBeCalledWith(35);
}

function testBeforeDeathEventIsFired() {
    const battler = new Game_Battler();
    battler.setHp(0);
    expect($gameTemp.reserveCommonEvent).toBeCalledWith(beforeDeathEvent);
}

function testKilledIdVariableIsSet() {
    const battler = new Game_Battler();
    battler._index = 3;
    battler.setHp(0);
    expect($gameVariables.setValue).toBeCalledWith(killedIdVariable, 3);
}

function testKilledActorTypeVariableSet() {
    const battler = new Game_Battler();
    battler._isEnemy = false;
    battler.setHp(0);
    expect($gameVariables.setValue).toBeCalledWith(killedEntityType, 1);
}

function testKilledEnemyTypeVariableSet() {
    const battler = new Game_Battler();
    battler._isEnemy = true;
    battler.setHp(0);
    expect($gameVariables.setValue).toBeCalledWith(killedEntityType, 2);
}

function testNoDamageBeforeBeforeDeathEventReturns() {
    const realSetHp = jest.fn();
    const battler = new Game_Battler(realSetHp);
    battler.setHp(0);
    expect(realSetHp).not.toBeCalled();
}

function testDamageAfterBeforeDeathEventReturns() {
    const realSetHp = jest.fn();
    const battler = new Game_Battler(realSetHp);
    battler.setHp(0);
    simulateBeforeDeathEvent();
    expect(realSetHp).toBeCalledWith(0);
}

describe('CustomDeaths plugin', () => {
    let continueDeath = null;

    beforeEach(() => {
        PluginManager.registerCommand.mockImplementation((name, command, func) => {
            if (name == "CustomDeaths" && command == "continue death") {
                continueDeath = func;
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('"continue death" command', () => {
        it('should be registered with the PluginManager', () => {
            setupPlugin();
            expect(PluginManager.registerCommand).toBeCalledWith("CustomDeaths", "continue death", expect.anything())
        });
    })

    describe('when a Game_Battler takes damage', () => {
        describe('when no events are provided', () => {
            beforeAll(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent: null,
                    beforeDeathEvent: null,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });

            it('should apply nonlethal damage normally', testNonLethalDamage);

            it('should apply lethal damage normally', () => {
                const realSetHp = jest.fn();
                const battler = new Game_Battler(realSetHp);
                battler.setHp(0);
                expect(realSetHp).toBeCalledWith(0);
            });

            it('should not call any events', () => {
                const battler = new Game_Battler();
                battler.setHp(0);
                expect($gameTemp.reserveCommonEvent).not.toBeCalled();
            });
        })

        describe('when a beforeDeathEvent is provided', () => {
            beforeAll(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent: null,
                    beforeDeathEvent,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });

            it('should apply nonlethal damage normally', testNonLethalDamage);

            it('should fire the beforeDeathEvent', testBeforeDeathEventIsFired);

            it('should set the value of the killedEntityType variable for enemies', testKilledEnemyTypeVariableSet);

            it('should set the value of the killedEntityType variable for actors', testKilledActorTypeVariableSet);

            it('should set the killedIdVariable variable', testKilledIdVariableIsSet);

            it.todo('should not let combat continue until control is returned from the beforeDeathEvent');

            it('should not apply the lethal damage before control has been returned by the beforeDeathEvent', testNoDamageBeforeBeforeDeathEventReturns);

            it.skip('should apply the lethal damage after control has been returned by the beforeDeathEvent', testDamageAfterBeforeDeathEventReturns);
        });

        describe('when an afterDeathEvent is provided', () => {
            beforeAll(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent,
                    beforeDeathEvent: null,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });


            it('should apply nonlethal damage normally', testNonLethalDamage);

            it.todo('should apply damage before the afterDeathEvent is fired');

            it('should fire the afterDeathEvent', () => {
                const battler = new Game_Battler();
                battler.setHp(0);
                expect($gameTemp.reserveCommonEvent).toBeCalledWith(afterDeathEvent);
            });

            it('should set the value of the killedEntityType variable for enemies', testKilledEnemyTypeVariableSet);

            it('should set the value of the killedEntityType variable for actors', testKilledActorTypeVariableSet);

            it('should set the killedIdVariable variable', testKilledIdVariableIsSet);

            it.todo('should delay the end of the battle until the afterDeathEvent has finished running if the death would finish the battle');
        });

        describe('when a beforeDeathEvent and an afterDeathEvent are provided', () => {
            beforeAll(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent,
                    beforeDeathEvent,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });

            it('should apply nonlethal damage normally', testNonLethalDamage);

            it('should fire the beforeDeathEvent', testBeforeDeathEventIsFired);

            it('should not apply the lethal damage before control has been returned by the beforeDeathEvent', testNoDamageBeforeBeforeDeathEventReturns);

            // check the order the functions are called
            it.skip('should apply damage before the afterDeathEvent is fired', () => {
                const realSetHp = jest.fn();
                const battler = new Game_Battler(realSetHp);
                battler.setHp(0);
                continueDeath();
                expect(realSetHp).toBeCalledWith(0);
            });

            it('should set the value of the killedEntityType variable for enemies', testKilledEnemyTypeVariableSet);

            it('should set the value of the killedEntityType variable for actors', testKilledActorTypeVariableSet);

            it('should set the killedIdVariable variable', testKilledIdVariableIsSet);

            it.todo('should not let combat continue until control is returned from the beforeDeathEvent');

            it.todo('should fire the afterDeathEvent after control is returned from the beforeDeathEvent');
        });
    });
});
