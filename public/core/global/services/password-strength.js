module.exports = [
  function(){
    /**
     *   PasstrengthMan
     *   Cute manager that checks your passwords and adds a
     *   class to a jQuery element depending on the password strength.
     *
     *   Would've been better if the strength validation thing wasn't done
     *   with regex, so I guess it is a todo!
     *
     *   @parameter {Object} $bound
     *     A jQuery object with stylings for a passtrength meter
     */
    this.PasstrengthMan = function($bound) {
      
      // Create a variable for referring to 'this' in subscopes
      var self = this;
      
      /**
       *  Define our matches.
       *  The keys in this object will also be
       *  used as classes appended to the passClassPrefix
          Strong password should be 8 to 16 characters, including 
          at least one upper case, lower case, number, and special character.
       *  
      */
      this.matches = {
        'default':/^\s+$/,
        'weak' : /(?=.*[a-z])/,
        'medium' : /(?=.*[a-z])(?=.*[A-Z]).{6,}|(?=.*[a-z])(?=.*\d).{6}/,
        'okay' : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}/,
        // 'strong' : /((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)).{8,}/,
        'strong' : /(?=^.{8,16}$)(?=.*?\d)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^a-zA-Z\d])/
      };
      
      // What our passclasses should be prepended with
      // This here is a 'BEM kind of thing' class
      this.passClassPrefix = p = 'passtrength--meter-';
      
      // Create an array of our passClasses, for removing them all more easily
      this.passClasses = ( function() {
        var passClasses = [];
        
        for ( var passClass in self.matches )
        {
          passClasses.push( p + passClass );
        }
        return passClasses;
      })();
      
      // The element to set our classes to
      this.$boundPasstrength = $bound;
    };

    this.PasstrengthMan.prototype = {
      capitalize:function(s) {
        return s.substr(0, 1).toUpperCase() + s.substr(1); 
      },
      validate : function( pass ) {
        var passClass = 'default';
        
        for ( var matchKey in this.matches )
        {
          if ( this.matches[ matchKey ].test( pass ) )
           passClass = matchKey;
        }
        
        this.$boundPasstrength
          .removeClass( this.passClasses.join(' ') )
          .addClass( this.passClassPrefix + passClass );
        
        // Return the passClass in a nice capitalized format
        // For the other part to do whatever it wants.
        return this.capitalize(passClass);
      }
    };

    /**
     *   DelayMan
     *   'Manager' for delaying function execution nicely
     *   Credits to: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
     *  ... Where I learnt it a couple of years ago!
    */
    this.DelayMan = ( function() {
      var timer = 0;
        
      return function( callback, t ){
        clearTimeout ( timer );
        timer = setTimeout( callback, t );
      };
    })();
  }
]