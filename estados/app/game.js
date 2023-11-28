var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: GameState,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

var MyGame = new Phaser.Game(config);
