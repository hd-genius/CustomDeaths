# CustomDeaths
The CustomDeaths plugin allows you to fire common events to customize how deaths are handled. The aim of this plugin is not to provide predefined death behaviors, but rather to allow you to hook into the necessary actions so that you can implement your own custom behaviors. Examples of features you can implement include:
- Reviving characters
- Rouge-like respawns
- Recruiting characters after defeat
- And much more

## Usage

This plugin is fairly simple and just requires a few parameters. Most of the custom behavior is implemented by the user in RPG Maker, this plugin just hooks in common events into the battler's deaths and provides the necessary relevant information to those events.

### Parameters

#### Before death event

This is a common event that you wish to have fired before a battler is killed. This event will be fired before every death, regardless of whether the battler is an actor or enemy or any other condition. If you only wish to handle certain battler's deaths then you will have to implement checks in your common to check the battler's [type](#killed-entity-type) and [id](#killed-entity-id-variable).

The [continue death](#continue-death) command must be called at the end of the common event so that control is returned to the regular flow of battle. Even if the effected battler is not the "intended" target of the common event, you must still call this command so the plugin can restore the battle to its regular flow and allow the battler to die. Due to the way battles are handled, this is currently a necessary feature of the plugin. 

#### After death event

This is a common event that you wish to have fired after a battler is killed. Similar to the before death event, this event will be fired after every death, regardless of whether the battler is an actor or enemy or any other condition. If you only wish to handle certain battler's deaths then you will have to implement checks in your common to check the battler's [type](#killed-entity-type) and [id](#killed-entity-id-variable).

The [continue death]() command must be called at the end of the common event so that control is returned to the regular flow of battle. Even if the effected battler is not the "intended" target of the common event, you must still call this command so the plugin can restore the battle to its regular flow and allow the battler to die. Due to the way battles are handled, this is currently a necessary feature of the plugin. 

#### Killed entity id variable

This is a variable that will hold the id, or more specifically the index, of the battler that is killed. When any of the common events in this plugin are triggered from this plugin this variable will be set so that you can determine the index of the entity that is killed. The index alone does not tell which battler the event effected. This can be used in conjunction with the [killed entity type](#killed-entity-type) variable to determine the exact battler that was impacted in the event.

#### Killed entity type

This is a variable that will hold the type of the entity that is killed. When any of the common events in this plugin are triggered from this plugin this variable will be set so that you can determine the type of the entity that is killed. This can be used in conjunction with the [killed entity id](#killed-entity-id-variable) variable to determine the exact battler that was impacted in the event.

##### Possible values
The value set in the variable can be interpreted as follows:

0 = Unset
1 = Actor
2 = Enemy

### Commands

#### continue death

This command returns the flow of control from the common event back to the regular flow of battle. It is used at the end of the [before death](#before-death-event) and [after death](#after-death-event) events.

## Planned features
- Opt out individual Actors/Enemies from the events so that you do not need to have as many edge cases and checks in scripts
