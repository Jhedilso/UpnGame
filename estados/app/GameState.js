class GameState extends Phaser.Scene {
    preload() {
        this.load.image('bg', 'recursos/assets/background.png');
        this.load.image('rock', 'recursos/assets/rock.png');
        this.load.image('platform-1', 'recursos/assets/platform-1.png');
        this.load.image('platform-2', 'recursos/assets/platform-2.png');
        this.load.spritesheet('crow', 'recursos/assets/crow.png', { frameWidth: 97, frameHeight: 120 });
        this.load.spritesheet('man', 'recursos/assets/man.png', { frameWidth: 69, frameHeight: 174 });
    }

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0);

        this.add.sprite(-100, this.sys.game.config.height - 88, 'platform-1');
        this.add.sprite(867, this.sys.game.config.height - 72, 'platform-2');
        this.add.image(355, this.sys.game.config.height - 115, 'rock');

        this.crow = this.add.sprite(150, 100, 'crow').setOrigin(0, 0);
        this.anims.create({
            key: 'crow-right',
            frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'crow-left',
            frames: this.anims.generateFrameNumbers('crow', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.crow.play('crow-right');

        this.man = this.add.sprite(200, this.sys.game.config.height - 250, 'man').setOrigin(0, 0);

        // Habilitar física para el sprite 'man'
        this.physics.world.enable(this.man);

        this.anims.create({
            key: 'man-right',
            frames: this.anims.generateFrameNumbers('man', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'man-left',
            frames: this.anims.generateFrameNumbers('man', { start: 15, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.man.play('man-left');

        // Configuración del teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.isJumping = false;
        this.jumpForce = 8; // Ajusta la fuerza de salto según sea necesario
        this.jumpStartY = 0;


        // Configuración de la barra de vida
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;

        // Crear la barra de vida
        this.healthBar = this.add.graphics();

        // Ajustar la barra de vida a la posición inicial del personaje
        this.updateHealthBarPosition();
    }

    update() {
        this.crow.x += 5;

        if (this.crow.x >= this.sys.game.config.width) {
            this.crow.x = -100;
        }

        // Salto
        if (this.jumpKey.isDown && !this.isJumping) {
            this.isJumping = true;
            this.jumpStartY = this.man.y;
            // Reducir la salud al saltar
            this.reduceHealth(10);
        }

        // Ajustar la posición y durante el salto
        if (this.isJumping) {
            this.man.y -= this.jumpForce;

            // Controlar la altura máxima del salto
            if (this.man.y <= this.jumpStartY - 100) {
                // Cuando alcanza la altura máxima, comienza a bajar
                this.jumpForce *= -1;
            }

            // Cuando vuelve al suelo, restablece el estado de salto
            if (this.man.y >= this.jumpStartY) {
                this.man.y = this.jumpStartY;
                this.isJumping = false;
                this.jumpForce = 8; // Restablece la fuerza de salto
            }
        }

        // Movimiento del sprite 'man' con las teclas de flecha
        const velocidadMovimiento = 2;
        if (this.cursors.left.isDown) {
            this.man.x -= velocidadMovimiento;
            this.man.play('man-left', true);
        } else if (this.cursors.right.isDown) {
            this.man.x += velocidadMovimiento;
            this.man.play('man-right', true);
        } else {
            // Si no se está moviendo, detener la animación
            this.man.anims.stop();
        }

        // Ajustar la posición de la barra de vida con respecto al personaje
        this.updateHealthBarPosition();

        // Verificar si la vida llega a cero
        if (this.currentHealth <= 0) {
            // Mostrar pantalla de Game Over
            this.gameOver();
        }
    }

    updateHealthBarPosition() {
        // Ajustar la posición de la barra de vida con respecto al personaje
        const barWidth = 100;
        const barHeight = 20;
        const barX = this.man.x - barWidth / 4;
        const barY = this.man.y - 18;

        this.healthBar.clear();
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(barX, barY, barWidth, barHeight);

        const remainingWidth = (this.currentHealth / this.maxHealth) * barWidth;
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(barX, barY, remainingWidth, barHeight);
    }

    reduceHealth(amount) {
        // Reducir la salud y actualizar la barra de vida
        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        this.updateHealthBar();
    }

    updateHealthBar() {
        // Actualizar la visualización de la barra de vida
        const barWidth = 100;
        const barHeight = 10;
        const barX = this.man.x - barWidth / 2;
        const barY = this.man.y - 20;

        this.healthBar.clear();
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(barX, barY, barWidth, barHeight);

        const remainingWidth = (this.currentHealth / this.maxHealth) * barWidth;
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(barX, barY, remainingWidth, barHeight);
    }
    gameOver() {
        // Puedes personalizar la pantalla de Game Over según tus necesidades
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Game Over', {
            fontSize: '92px',
            fill: '#fff'
        }).setOrigin(0.5);
        // Puedes reiniciar el juego o realizar otras acciones aquí
        // Por ejemplo, reiniciar el juego después de unos segundos
        this.time.delayedCall(3000, () => {
            this.scene.restart();
        });
    }
}
