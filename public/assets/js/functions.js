
let functions = {
    allBucket: () => {
        let bucketList = new Promise((resolve, reject) => {

            $.get("/api/buckets", (response) => {
                resolve(response);
                reject("Something wrong happened");
            })
        });

        return bucketList;
    },
    listBucketObject: (bucketName) => {

        let bucketObject = new Promise((resolve, reject) => {

            $.get(`/api/bucketobject/${bucketName}`, (results) => {
                resolve(results);
                reject("something is wrong");
            });
        });

        return bucketObject;

    },
    addBucket: (bucketName) => {
        let data = new Promise((resolve, reject) => {

            $.post("/api/addbucket", bucketName, (response) => {
                // location.reload();
                resolve(response);
                reject("Something wrong happned")
            });
        });

        return data;
    },
    deleteBucket: (bucketName) => {
        let isDelete = new Promise((resolve, reject) => {

            $.ajax({
                url: `/api/deletebucket/${bucketName}`,
                type: 'DELETE',
                success: (result) => {
                    resolve(result);
                }
            });
        });

        return isDelete;
    },
    deleteBucketObject: (bucketNameObjectKey) => {
        let isDeletedObject = new Promise((resolve, reject) => {

            $.ajax({
                url: `/api/deleteobject/${bucketNameObjectKey}`,
                type: 'DELETE',
                success: (result) => {
                    resolve(result);
                }
            })
        });

        return isDeletedObject;
    }
}


export default functions;