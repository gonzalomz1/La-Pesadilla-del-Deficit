class Nivel{
    constructor(world, app, alto, ancho){
        this.world = world;
        this.app = app;
        this.alto = alto;
        this.ancho = ancho;
        this.enemigos = [];
        this.sistemasXP = [];
        
        this.plataformas = [];
        this.crearPlataformas();
        this.arrayDeSpawn = this.crearSpawnDeEnemigos();
        this.agregarEnemigos(2);
        this.indicarNivelActual(this);
    }

    crearPlataformas(){
        // Array de posiciones de las plataformas (x, y, ancho, alto)
        const plataformasData = [
            {x: this.ancho / 2, y: this.alto -200, width: 800, height: 32 }, // Plataforma inferior
            {x: this.ancho / 2 - 200, y: this.alto / 2, width: 96, height: 32 }, // Plataforma izquierda
            {x: this.ancho / 2 + 200, y: this.alto / 2, width: 96, height: 32 }, // Plataforma derecha
            {x: this.ancho / 2, y: this.alto / 3, width: 96, height: 32 } // Plataforma superior
        ];

        // Crear las plataformas en Matter.js y PixiJS
        plataformasData.forEach((data) => {
            // Cuerpo en Matter.js
            const plataforma = Matter.Bodies.rectangle(data.x, data.y, data.width, data.height, { isStatic: true, label: 'Suelo'});
            Matter.World.add(this.world, plataforma);

            //Grafico en PixiJS
            const plataformaSprite = new PIXI.Graphics();
            plataformaSprite.beginFill(0x646464) // Color Gris
            plataformaSprite.drawRect(-data.width / 2, -data.height / 2, data.width, data.height);
            plataformaSprite.endFill();
            plataformaSprite.x = data.x;
            plataformaSprite.y = data.y;
            plataformaSprite.name = 'Suelo';
            this.app.stage.addChild(plataformaSprite);

            // Almacenar la referencia a la plataforma
            this.plataformas.push({cuerpo: plataforma, sprite: plataformaSprite});

        });
    }

    crearSpawnDeEnemigos(){
        let spawns = [];
        const spawn1 = new SpawnPoint(this.world, this.app, this.ancho / 2 - 200, this.alto / 2 - 100);
        spawns.push(spawn1);
        const spawn2 = new SpawnPoint(this.world, this.app, this.ancho / 2 + 200, this.alto / 2 - 100);
        spawns.push(spawn2);
        return spawns;
    }

    agregarEnemigos(cantidad){
        while (cantidad > 0){
            const spawn = this.arrayDeSpawn[Math.floor(Math.random() * this.arrayDeSpawn.length)];
            const enemigo = spawn.spawnEnemigo();
            this.enemigos.push(enemigo);
            cantidad--;
        }
    }

    indicarNivelActual(nivel){
        modificarNivelActual(nivel);
    }

    update(){
        this.enemigos.forEach(enemigo => enemigo.update());
        this.sistemasXP.forEach(sistema => sistema.update(detectarJugador()));
        // Sincronizar las plataformas entre Matter.js y PixiJS
        this.plataformas.forEach((plataforma) => {
            plataforma.sprite.x = plataforma.cuerpo.position.x;
            plataforma.sprite.y = plataforma.cuerpo.position.y;
        })
    }


}