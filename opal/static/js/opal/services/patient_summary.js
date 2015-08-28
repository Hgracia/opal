//
// This is the main PatientSummary class for OPAL.
//
angular.module('opal.services').factory('PatientSummary', function() {
        var PatientSummary = function(jsonResponse){

            if(jsonResponse.start_date && jsonResponse.end_date){
                startYear= moment(jsonResponse.start_date, 'YYYY-MM-DD').format("YYYY");
                endYear = moment(jsonResponse.end_date, 'YYYY-MM-DD').format("YYYY");
            }

            if(startYear !== endYear){
                this.years = startYear + "-" + endYear;
            }
            else{
                this.years = startYear;
            }
            this.name = jsonResponse.name;
            this.count = jsonResponse.count;
            this.dateOfBirth = moment(jsonResponse.date_of_birth, 'YYYY-MM-DD');
            this.categories = jsonResponse.categories.join(", ");
            this.link = "#/episode/" + jsonResponse.episode_id;
            this.hospitalNumber = jsonResponse.hospital_number;
        };

        return PatientSummary;
    });