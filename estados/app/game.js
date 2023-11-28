var MyGame = new Phaser.Game(1024, 768, Phaser.AUTO, 'game-container');

MyGame.scene.add('game', GameState);
MyGame.scene.start('game');