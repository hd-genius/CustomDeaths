const $gameVariables = {
    setValue: jest.fn(),
    value: jest.fn()
};

exports.$gameVariables = $gameVariables;

global.$gameVariables = $gameVariables;