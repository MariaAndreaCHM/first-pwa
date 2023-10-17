//crtea la base de datos
let req = window.indexedDB.open('pwadb',1);
req.onupgradeneeded=(e)=>{
    console.log("DB UPDATED");
    let db = e.target.result;
    db.createObjectStore('users',{
        keypath:'id',
    })
};
req.onerror=(e)=>{
    console.log('db-error->',e.tarjet.error);
};
req.onsuccess=(e)=>{
    let db=e.tarjet.result;
    let transaction=db.transaction('users','readwrite');
    transaction.onerror=(e)=>{
        console.log('TR-ERROR->',e.target.error);
    }
    transaction.oncomplet=(e)=>{
        console.log('TR-done->',e);
    };
    let stored= transaction.objectStore('users');
    stored.add({
        id: new Date().toISOString(),
        username:'andrea',
        fullname:'copca'
    });
    stored.onsuccess=(e)=>{
        console.log('ST-SUCSS->','agrgado correctamente');
    }
}
