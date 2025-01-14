import express from 'express';
import session from 'express-session';
import moment  from 'moment-timezone';

const app= express(); //HABILITA EL USO DE LOS VERBOS HTTP, GET, PST, PATHC,DELETE, ECT

//La configuracion de las sesiones
app.use(
    session({
        secret:'p3-Obed#OBGF-sessiionespersistentes',
        resave: false, //permite desabilitar los cambios 
        saveUninitialized: true,  //si no esta inicializada que se inicialize
        cookie: {maxAge: 24*60*60*100}
    })
)


//Ruta para inicializar la sesion
app.get('/iniciar-sesion', (req,res)=>{
    if(!req.session.inicio){
        req.session.inicio= new Date(); //Fecha de inicio de sesion
        req.session.ultimoacceso= new Date(); //Ultima consulta inicial
        res.send('Sesion iniciada')
        
    }else{
        res.send('La sesion ya esta activa')
    }
});


// Ruta para actulizar la fecha de última consulta
app.get('/actualizar', (req,res )=>{
    if(req.session.inicio){
        req.session.ultimoAcceso = new Date();
        res.send('Fecha de última consulta actualizada');
    }else{
        res.send('No hay una sesion activa');

    }

})


//Ruta para ver el estado de la sesion 
app.get('/estado-sesion', (req,res)=>{

    if(req.session.inicio){
        const inicio = new Date(req.session.inicio);
        const ultimoAcceso = new Date(req.session.ultimoAcceso);
        const ahora = new Date();

        // Calcular la antiguedad de la SESION
        const antiguedadMS= ahora - inicio;
        const horas= Math.floor(antiguedadMS/(1000*60*60));
        const minutos=Math.floor(antiguedadMS%(1000*60*60)/(1000*60));
        const segundos =Math.floor(antiguedadMS%(1000*60)/1000);
     
        //Convertimos las fechas al huso horario CDMX
        const inicioCDMX= moment(inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const ultimoCDMX= moment(ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        

        res.json({
            mensaje: 'Estado de la sesion',
            sesionID: req.sessionID,
            inicio: inicioCDMX,
            ultimoAcceso: ultimoCDMX,
            antiguedad: `${horas} horas, ${minutos}minutos, ${segundos}`
        });

    } else {
        res.send ('No hay una sesion activa.')
    }
});

// Ruta para cerrar la sesion
 app.get('/cerrar-sesion', (req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send('Error al cerrar ka sesion.');
            }
            res.send('Sesion cerrada correctamente.');
        });
    }else {
        res.send('No hay una sesion activa para cerrar.');
    }
 }); 


 //inicializar el servidor

 const PORT = 3000;

 app.listen(PORT, ()=>{
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);



 })










