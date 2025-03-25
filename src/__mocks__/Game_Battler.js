class Game_Battler {
    _isEnemy = true;
    _index = 0;
    
    constructor(setHpImpl = () => {}) {
        this._setHp = setHpImpl;
    }

    isEnemy() {
        return this._isEnemy;
    }

    isActor() {
        return !this._isEnemy;
    }

    setHp(hp) {
        this._setHp(hp);
    }

    index() {
        return this._index;
    }
};

global.Game_Battler = Game_Battler;