var GameState = {
    preload : function(){
        var me = this;
        me.load.image('bg', 'recursos/assets/spacio3.png');
    },
    create() {
        // Añadir objetos al juego aquí
        this.add.image(-100, 0, 'bg');
    },
    update : function(){
        console.log("Preload...");
    }
}