var RequestRouter = (function () {

    return {

        route: function (handle, pathname, request,response) {
            if (typeof handle[pathname] === 'function') {
                console.log('Route Request for ' + pathname );
                return handle[pathname](request,response);
            }
            else {
                console.log('Unsupported Request');
            }
        }
    }

})();

module.exports = RequestRouter;