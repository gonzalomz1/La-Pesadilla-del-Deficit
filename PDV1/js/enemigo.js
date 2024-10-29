class Enemigo {
    constructor(world, app, x, y){
        this.world = world;
        this.app = app;
        this.x = x;
        this.y = y;
        this.vida = 3;
        this.danio = 1;
        this.tipo = 'test';

        // Flag para evitar daño repetido
        this.puedeRecibirDanio = true;
        this.tiempoEsperaDanio = 500; // En ms

        // Crear sprite para representacion grafica
        this.sprite = new PIXI.Graphics();
        this.sprite.name = 'Enemigo';
        this.sprite.entidad = this;
        this.sprite.interactive = true;
        this.sprite.beginFill(0xff0000) // Color rojo
        this.sprite.drawRect(-16, -16, 32, 32);
        this.sprite.endFill();
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.app.stage.addChild(this.sprite);
        
        this.rectBounds = this.sprite.getBounds(); // Cachear bounds

        // Crear cuerpo fisico en Matter
        this.body = Matter.Bodies.rectangle(this.x, this.y, 32, 32, {
            label: 'Enemigo',
            tipo: this.tipo,
            entidad: this
        });
        Matter.Body.setInertia(this.body, Infinity);
        Matter.World.add(this.world, this.body);
    }

    esEnemigo() {
        return true;
    }

    recibirDanio(cantidad, direccionImpacto){
        if (!this.puedeRecibirDanio) return; // Salir si no puede recibir daño
        console.log('Enemigo recibio daño: ', cantidad);
        this.vida -= cantidad;
        this.puedeRecibirDanio = false;
        this.aplicarKnockbackYVerificarVida(direccionImpacto, cantidad);
    }

    aplicarKnockbackYVerificarVida(direccionNormalizada, cantidad) {
        const fuerzaBase = 0.015;
        const multiplicador = (this.vida <= 0) ? 4 : 1;
        const fuerzaKnockback = cantidad * fuerzaBase * multiplicador;
        this.aplicarKnockback(fuerzaKnockback, direccionNormalizada);
        setTimeout (() => {
        if (this.vida <= 0) {
            console.log('Enemigo destruido')
            this.generarParticulasXP();
            this.destruir();
        } else this.puedeRecibirDanio = true;
        }, this.tiempoEsperaDanio);
    }

    aplicarKnockback(fuerzaKnockback, direccionNormalizada){
        console.log('enemigo que recibe knockback: ', this);
        console.log('fuerza de knockback: ', fuerzaKnockback);
        console.log('direccion normalizada: ', direccionNormalizada);
        Matter.Body.applyForce(
            this.body,
            this.body.position,
            {
                x: direccionNormalizada.x * fuerzaKnockback,
                y: direccionNormalizada.y * fuerzaKnockback
            }
        );
    }

    generarParticulasXP(){
        const sistemaXP = new SistemaParticulasXP(this.app, 10, this.sprite.x, this.sprite.y);
        const nivelActual = detectarNivelActual();
        nivelActual.sistemasXP.push(sistemaXP); // Almacenar sistemas activos
    }

    destruir(){
        Matter.World.remove(this.world, this.body);
        this.sprite.destroy({children: true, texture: true, baseTexture: true});
        const nivelActual = detectarNivelActual();
        nivelActual.enemigos = nivelActual.enemigos.filter(enemigo => enemigo !== this);
    }

    update(){
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
        this.rectBounds = this.sprite.getBounds();
    }
}