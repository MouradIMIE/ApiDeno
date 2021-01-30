export default interface SongInterfaces {
    _id?: { $oid: string } | string | null,
    name: string,
    cover: string,
    url: string,
    type: string,
    time: string,
    createdAt: Date,
    updateAt: Date
}