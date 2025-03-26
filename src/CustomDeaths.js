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
 * @desc Called while handling death events to resume death as it would have happened before the flow was interrupted.
 * 
 * @param beforeDeathEvent
 * @text Before death event
 * @type common_event
 * @desc The common event that is fired before a battler would take lethal damage. At this point the battler has not yet died.
 * 
 * @param afterDeathEvent
 * @text After death event
 * @type common_event
 * @desc The common event that is fired after a battler takes lethal damage. At this point the battler has already died.
 * 
 * @param killedIdVariable
 * @text Killed entity id variable
 * @type variable
 * @desc The variable to store the killed entity's index number in when events are fired.
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

    const runCommonEvent = event => {
        $gameTemp.reserveCommonEvent(event);
        console.log(`reserved common event ${event}`)
    };

    let lastKilledBattler = null;

    // Overwrite the health management functions to implement checks and custom event calls
    const originalSetHp = Game_Battler.prototype.setHp;

    Game_Battler.prototype.setHp = function (newHp) {
        // if battler would die trigger events
        if (newHp <= 0) {
            this.pendingNewHp = newHp;

            $gameVariables.setValue(killedIdVariable, this.index());
            $gameVariables.setValue(killedEntityType, typeOfBattler(this));

            console.log('index killed: %d', $gameVariables.value(killedIdVariable));
            console.log(`entity killed is an ${$gameVariables.value(killedEntityType) == 1 ? 'Actor' : 'Enemy'}`)

            if (beforeDeathEvent) {
                runCommonEvent(beforeDeathEvent);

                lastKilledBattler = this;

                // Prevent the last battler from dying before the custom event can be run
                // setTimeout(() => {
                //     originalSetHp.call(this, 0);
                // }, 1000)
            } else {
                this.continueDeath();
            }
        } else {
            originalSetHp.call(this, newHp);
        }
    };

    Game_Battler.prototype.continueDeath = function () {
        originalSetHp.call(this, this.pendingNewHp);
        if (afterDeathEvent) {
            runCommonEvent(afterDeathEvent);
        }
        lastKilledBattler = null;
    };

    PluginManager.registerCommand(pluginName, "continue death", args => {
        lastKilledBattler?.continueDeath();
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


