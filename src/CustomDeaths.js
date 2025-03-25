//=============================================================================
// CustomDeaths.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc extra events and customizations to allow deaths to be handled
 * with more control
 * @author Roy Stewart
 * 
 * @help TODO
 * 
 * TODO: add details on how to use the plugin
 * 
 * @command continueDeath
 * @text Continue death
 * @desc Resume death as it would have happened before the flow was interrupted
 * 
 * @param beforeDeathEvent
 * @text Before death event
 * @type common_event
 * @desc The common event that is fired right before a battler would take lethal damage
 * 
 * @param afterDeathEvent
 * @text After death event
 * @type common_event
 * @desc The common event that is fired right after a battler takes lethal damage
 * 
 * @param killedIdVariable
 * @text Killed entity id variable
 * @type variable
 * @desc The variable to store the killed entity's index number in when events are fired
 * 
 * @param killedEntityType
 * @text Killed entity type
 * @type variable
 * @desc The variable to store the entity type in. 0 = unset, 1 = actor, 2 = enemy
 */

(function () {
    const pluginName = "CustomDeaths";
    const { afterDeathEvent, beforeDeathEvent, killedEntityType, killedIdVariable } = PluginManager.parameters(pluginName);

    const typeOfBattler = battler => battler.isActor() ? 1 : 2;

    // Overwrite the health management functions to implement checks and custom event calls
    const originalSetHp = Game_Battler.prototype.setHp;

    let afterDeathHealth = 0;

    const runCommonEvent = event => {
        $gameTemp.reserveCommonEvent(event);
        console.log(`reserved common event ${event}`)
    }

    const continueDeath = battler => {
        originalSetHp.call(battler, afterDeathHealth);
        if (afterDeathEvent) {
            runCommonEvent(afterDeathEvent);
        }
    };

    const logKilledBattler = () => {
        console.log('index killed: %d', $gameVariables.value(killedIdVariable));
        console.log(`entity killed is an ${$gameVariables.value(killedEntityType) == 1 ? 'Actor' : 'Enemy'}`)
    }

    Game_Battler.prototype.setHp = function (newHp) {
        // if battler would die trigger events
        if (newHp <= 0) {
            afterDeathHealth = newHp;

            $gameVariables.setValue(killedIdVariable, this.index());
            $gameVariables.setValue(killedEntityType, typeOfBattler(this));

            logKilledBattler();

            if (beforeDeathEvent) {
                runCommonEvent(beforeDeathEvent);

                // Prevent the last battler from dying before the custom event can be run
                // setTimeout(() => {
                //     originalSetHp.call(this, 0);
                // }, 1000)
            } else {
                continueDeath(this);
            }
        } else {
            originalSetHp.call(this, newHp);
        }
    };

    PluginManager.registerCommand(pluginName, "continue death", args => {
        continueDeath(null);
    });

    // // Overwrite the health management functions to implement checks and custom event calls
    // const originalBattlerDie = Game_Battler.prototype.die;
    // Game_Battler.prototype.die = function() {
    // };

    // // Prevent battle from ending before last die event triggers
    // const originalUpdateBattleEnd = BattleManager.updateBattleEnd.bind(BattleManager);
    // BattleManager.updateBattleEnd = function() {
    // }

    // // Prevent battle from ending before last die event triggers
    // const originalProcessDefeat = BattleManager.processDefeat.bind(BattleManager);
    // BattleManager.processDefeat = function() {
    // }
})()


