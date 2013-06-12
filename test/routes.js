var routes = require('../routes');
var expect = require('expect.js');

var request = {};
var response = {
    viewName: "",
    data : {},
    render: function(view, viewData) {
        this.viewName = view;
        this.data = viewData;
    }
};

describe('routes', function() {
    describe('#show Index', function() {
      it('should be a function and set proper ViewName and viewData', function() {
          expect(routes.index).to.be.a('function');
          routes.index(request, response);
          expect(response.viewName).to.be('index');
          expect(response.data).to.not.be.empty();
      });
    });
    describe('#show contact', function() {
        it('should be a function and set proper ViewName and viewData', function() {
            expect(routes.contact).to.be.a('function');
            routes.contact(request, response);
            expect(response.viewName).to.be('contact');
            expect(response.data).to.not.be.empty();
        });
    });
    describe('#show about', function(done) {
        it('should be a function and set proper ViewName and viewData', function() {
            expect(routes.about).to.be.a('function');
            routes.about(request, response);
            expect(response.viewName).to.be('about');
            expect(response.data).to.not.be.empty();
            done();
        });
    });
    describe('#show connect', function() {
        it('should be a function and set proper ViewName and viewData', function() {
            expect(routes.connect).to.be.a('function');
            routes.connect(request, response);
            expect(response.viewName).to.be('connect');
            expect(response.data).to.not.be.empty();
        });
    });
});
