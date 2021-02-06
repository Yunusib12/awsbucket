import functions from './functions.js';

$(() => {

    /* Global Variables
    =================================== */

    const $bucketName = $("#bucketName");
    const $input = $("input");
    const $message = $(".message");
    const $inputDelete = $("#inputDelete");
    const $inputUpload = $("#inputUpload");
    const $btnDelete = $(".delete");
    const $btnUpload = $(".upload");
    const $bucketObject = $(".fa-trash");
    const $bucketList = $(".bucketList");
    const $bListFile = $(".bListFile");

    let runnedDelete = false;
    let runnedUpload = false;

    $btnDelete.prop('disabled', true);
    $btnUpload.prop('disabled', true);


    /* MESSAGE
    =================================== */

    let message = (msg, style) => {

        $message.text(msg)
            .removeClass()
            .addClass(`message alert alert-${style}`)
            .attr("role", "alert")
            .show()
            .fadeOut(5000)
            .appendTo("body");
    }

    /* EVENTS
    =================================== */

    //Create Bucket
    $(".create").on("click", (e) => {
        e.preventDefault();

        if ($input.val() === "") {

            message("Bucket Name can not be empty! ", "danger")

        } else {

            const bucketParams = {
                bucketName: $bucketName.val().trim()
            };

            let data = functions.addBucket(bucketParams);


            data.then((response) => {

                const bucketCreatedMsg = `${response.msg} - ${(response.data.Location).substring(1)}`;

                message(bucketCreatedMsg, "success");
                location.reload();
            })

            $bucketName.val("");
        }
    });

    //Delete Bucket 
    $($inputDelete).on("click", () => {

        let bucketList = functions.allBucket();
        $btnDelete.prop("disabled", false);

        if (!runnedDelete) {
            runnedDelete = true;
            bucketList.then((response) => {
                const bucketListArray = response.Buckets;

                $($inputDelete).append(`<option value="" selected="selected">Select a bucket</option>`);

                bucketListArray.map((bucket) => {
                    $($inputDelete).append(`<option value="${bucket.Name}">${bucket.Name}</option>`);
                });
            });
        }
    });

    $('.delete').on("click", (e) => {
        e.preventDefault();

        let bucketSelected = $("#inputDelete option:selected").val();

        if (bucketSelected !== undefined) {
            const isBucketDelete = functions.deleteBucket(bucketSelected);

            isBucketDelete.then((result) => {

                if (result === true) {
                    message("Bucket deleted successfully", "success");
                    location.reload();
                };

                if (result.code === "BucketNotEmpty") message(result.message, "danger");

            })
        } else {
            message("Please select a Bucket!", "warning");
        }
    });


    //File Upload Bucket
    $($inputUpload).on("click", () => {

        let bucketList = functions.allBucket();
        $btnUpload.prop("disabled", false);

        if (!runnedUpload) {
            runnedUpload = true;
            bucketList.then((response) => {
                const bucketListArray = response.Buckets;

                $($inputUpload).append(`<option value="" selected="selected">Select a bucket</option>`);

                bucketListArray.map((bucket) => {
                    $($inputUpload).append(`<option value="${bucket.Name}">${bucket.Name}</option>`);
                });
            });
        }
    });

    $($inputUpload).on("change", () => {

        const $inputSelectedValue = $("#inputUpload option:selected").val();

        $("#bucketUpload").attr({ "action": `/api/upload/${$inputSelectedValue}` });

    })

    //Delete Bucket Object
    $(document).on("click", $bucketObject, (e) => {

        const bucketNameObjectKey = $(e.target).attr("dataobject");

        const isDeleted = functions.deleteBucketObject(bucketNameObjectKey);

        isDeleted.then((results) => {

            const isObjectEmpty = Object.keys(results).length;
            if (isObjectEmpty === 0) {

                const objectDeletedMsg = `Bucket Object Deleted`;

                message(objectDeletedMsg, "success");
                location.reload();
            }
            else {
                const objectDeletedMsg = `Something went wrong try again`;

                message(objectDeletedMsg, "danger");
            }
        });
    });

    // On page load
    let listAllBucket = functions.allBucket();

    listAllBucket.then((data) => {

        const bListArr = data.Buckets;
        let totalBucket = 0;

        bListArr.map((bucket) => {

            let bucketObj = functions.listBucketObject(bucket.Name);
            totalBucket++;

            bucketObj.then((results) => {
                const contentLengths = results.Contents.length;
                const bucketName = results.Name;

                let bucketDiv = $('<div>')
                    .addClass("bucket");

                let bucketLabel = $('<label>')
                    .text("Bucket Name")
                    .appendTo(bucketDiv);

                let bucketTitle = $('<h5>')
                    .text(bucketName)
                    .appendTo(bucketDiv);

                if (contentLengths > 0) {

                    let bucketFileLabel = $('<label>')
                        .text("Bucket Files")
                        .appendTo(bucketDiv);

                    let bucketFileUl = $('<ul>').appendTo(bucketDiv);

                    const bucketFileArray = results.Contents;

                    bucketFileArray.map((file) => {
                        const fileName = file.Key;

                        let bucketFileList = $('<li>')
                            .appendTo(bucketFileUl);

                        let bucketFileLink = $('<a>')
                            .text(fileName)
                            .attr({
                                href: `https://${bucketName}.s3.amazonaws.com/${fileName}`
                            })
                            .appendTo(bucketFileList);

                        let deleteIcone = $('<i>')
                            .attr({
                                dataobject: `${bucketName}/${fileName}`
                            })
                            .addClass("fas fa-trash")
                            .appendTo(bucketFileList);

                    })
                } else {
                    let noBucketFile = $('<label>')
                        .text("No File")
                        .appendTo(bucketDiv);
                }

                bucketDiv.appendTo($bucketList);
            })


        })

        let tBucket = $("<label>")
            .text(totalBucket)
            .addClass("tBucket")
            .appendTo($bListFile);
    });

})