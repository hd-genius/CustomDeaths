const mockPluginManager = {
    registerCommand: jest.fn(),
    parameters: jest.fn()
};

mockPluginManager.parameters.mockReturnValue({
    afterDeathEvent: 1,
    beforeDeathEvent: 1,
    killedIdVariable: 1,
    killedEntityType: 1
})

exports.PluginManager = mockPluginManager;
global.PluginManager = mockPluginManager;
