define(['jQuery', 'logger', 'grid', 'version', 'detector', 'formatinf', 'errorlevel', 'bitmat', 'datablock', 'bmparser', 'datamask', 'rsdecoder', 'gf256poly', 'gf256', 'decoder', 'qrcode', 'findpat', 'alignpat', 'databr'],
function($, logger, grid, version, detector, formatinf, errorlevel, bitmat, datablock, bmparser, datamask, rsdecoder, gf256poly, gf256, decoder, qrcode, findpat, alignpat, databr) {
    var QrDecoder = function () {

        this.qrImg=new Image();
        var that = this;
        this.qrImg.onload = function(){
            try{
                qrcode.decode(that.qrImg.src);
                qrcode.callback = function (data){
                    //QR-Code Inhalt hier verfügbar!!
                    //console.log("callback of qrcode");
                    that.checkMessage(data)
                };
            }catch(e){
            }
        };

    };

    QrDecoder.prototype.checkMessage = function(data){
        //Todo
        if(data != "Error") {
            console.log("qrcode found:" + data);
            $(this).trigger("QRCODE",data);
        }
    }


    QrDecoder.prototype.setQrCodeSrc = function(src){
        this.qrImg.src=src;
    }

    return QrDecoder;
});
