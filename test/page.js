var server = require('../server.js'),
    expect = require('expect.js'),
    assert = require('assert'),
    Browser = require('zombie'),
    http = require('http'),
    browser = new Browser({debug:true}),
    Testserver=0;


describe('Check Page ', function(){

    before(function(){
        Testserver = http.createServer(server).listen(server.get('port'), function(){
            console.log("Express server listening on port " + server.get('port'));
        });
        browser.site = 'localhost:'+server.get('port');
        browser.loadCSS = false;
        browser.runScripts = false;
    });

    after(function(){
        browser.close();
        Testserver.close();
    });

    it('assets', function(done) {
        browser.visit("/bootstrap/css/bootstrap.min.css", function () {
            expect(browser.statusCode).to.equal(200 || 304);
        });
        browser.visit("/bootstrap/css/bootstrap-responsive.min.css", function () {
            expect(browser.statusCode).to.equal(200 || 304);
        });
        browser.visit("/stylesheets/style.css", function () {
            expect(browser.statusCode).to.equal(200 || 304);
        });
        browser.visit("/bootstrap/js/bootstrap.min.js", function () {
            expect(browser.statusCode).to.equal(200 || 304);
            done();
        });
     });

    it('/', function(done){

        browser.visit("/", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/');
            expect(browser.text("title")).to.equal('Node-Copter');
            done();
        });
    });

    it('/connect', function(done){
        browser.visit("/connect", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/connect');
            expect(browser.html("footer>p")).to.contain("Michael");
            done();
        });
    });

    it('/about', function(done){
        browser.visit("/about", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/about');
            expect(browser.html("footer>p")).to.contain("Michael");
            done();
        });
    });

    it('/contact', function(done){
        browser.visit("/contact", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/contact');
            expect(browser.html("address>a")).to.contain('mhettegger.mmtb2011');
            done();
        });
    });

    it('links', function(done){
        browser.visit("/", function() {
            browser.clickLink("Contact", function() {
                expect(browser.text("title")).to.equal('Node-Copter');
                done();
            });
        });
    });
    it('links /', function(done){
        browser.visit("/", function() {
            browser.clickLink("Contact", function() {
                expect(browser.html("")).to.contain('mhettegger.mmtb2011');
                done();
            });
        });
    });
});

