export const convertSnaps = <T>(snaps) => {
    console.log(snaps);
    return <T[]> snaps.map(snap => {
        return {
            id:snap.payload.doc.id,
            ...snap.payload.doc.data()
        };
    });
};