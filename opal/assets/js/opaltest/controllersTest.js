describe('controllers', function() {
	var columns, patientData, Schema, schema, Patient;

	beforeEach(function() {
		module('opal.controllers');
		columns = [
			{
				name: 'demographics',
			   	single: true,
			   	fields: [
					{name: 'name', type: 'string'},
					{name: 'date_of_birth', type: 'date'},
				]},
			{
				name: 'location',
				single: true,
				fields: [
					{name: 'category', type: 'string'},
					{name: 'hospital', type: 'string'},
					{name: 'ward', type: 'string'},
					{name: 'bed', type: 'string'},
					{name: 'date_of_admission', type: 'date'},
					{name: 'tags', type: 'list'},
				]},
			{
				name: 'diagnosis',
				single: false,
				fields: [
					{name: 'condition', type: 'string'},
					{name: 'provisional', type: 'boolean'},
				]},
		];
		patientData = {
			id: 123,
			demographics: [{
				id: 101,
				name: 'John Smith',
				date_of_birth: '1980-07-31'
			}],
			location: [{
				category: 'Inpatient',
				hospital: 'UCH',
				ward: 'T10',
				bed: '15',
				date_of_admission: '2013-08-01',
				tags: {'mine': true, 'tropical': true}
			}],
			diagnosis: [{
				id: 102,
				condition: 'Dengue',
				provisional: true,
			}, {
				id: 103,
				condition: 'Malaria',
				provisional: false,
			}]
		};

		inject(function($injector) {
			Schema = $injector.get('Schema');
			Patient = $injector.get('Patient');
		});

		schema = new Schema(columns);
	});

	describe('PatientListCtrl', function() {
		var $scope, $cookieStore, $controller, $q, $dialog;
		var patients, controller;

		beforeEach(function() {
			inject(function($injector) {
				$rootScope = $injector.get('$rootScope');
				$scope = $rootScope.$new();
				$cookieStore = $injector.get('$cookieStore');
				$controller = $injector.get('$controller');
				$q = $injector.get('$q');
				$dialog = $injector.get('$dialog');
			});

			patients = [new Patient(patientData, schema)];

			controller = $controller('PatientListCtrl', {
				$scope: $scope,
				$cookieStore: $cookieStore,
				schema: schema,
				patients: patients
			});
		});

		describe('newly-created controller', function() {
			it('should have state "normal"', function() {
				expect($scope.state).toBe('normal');
			});
		});

		describe('editing an item', function() {
			beforeEach(function() {
				inject(function($injector) {
				});
			});

			it('should select that item', function() {
				$scope.editItem(0, 0, 0);
				expect([$scope.rix, $scope.cix, $scope.iix]).toEqual([0, 0, 0]);
			});

			it('should change state to "editing"', function() {
				$scope.editItem(0, 0, 0);
				expect($scope.state).toBe('editing');
			});

			it('should set up the demographics modal', function() {
				var callArgs;

				spyOn($dialog, 'dialog').andCallThrough();

				$scope.editItem(0, 0, 0);

				callArgs = $dialog.dialog.mostRecentCall.args;
				expect(callArgs.length).toBe(1);
				expect(callArgs[0].templateUrl).toBe('/templates/modals/demographics.html/');
				expect(callArgs[0].controller).toBe('EditItemModalCtrl');
				expect(callArgs[0].resolve.item()).toEqual($scope.patients[0].demographics[0]);
			});

			it('should open the demographics modal', function() {
				var modalSpy;

				modalSpy = {open: function() {}};
				spyOn($dialog, 'dialog').andReturn(modalSpy);
				spyOn(modalSpy, 'open').andReturn({then: function() {}});

				$scope.editItem(0, 0, 0);

				expect(modalSpy.open).toHaveBeenCalled();
			});

			it('should change state to "normal" when the modal is closed', function() {
				var deferred, modalSpy;

				deferred = $q.defer();
				modalSpy = {open: function() {}};
				spyOn($dialog, 'dialog').andReturn(modalSpy);
				spyOn(modalSpy, 'open').andReturn(deferred.promise);

				$scope.editItem(0, 0, 0);

				deferred.resolve('save');
				$rootScope.$apply();

				expect($scope.state).toBe('normal');
			});

			it('should add a new item if result is "add-another"', function() {
				var deferred, modalSpy;

				deferred = $q.defer();
				modalSpy = {open: function() {}};
				spyOn($dialog, 'dialog').andReturn(modalSpy);
				spyOn(modalSpy, 'open').andReturn(deferred.promise);

				$scope.editItem(0, 0, 0);

				spyOn($scope, 'editItem');
				deferred.resolve('add-another');
				$rootScope.$apply();

				expect($scope.editItem).toHaveBeenCalledWith(0, 0, 1);
			});
		});
	});
});
