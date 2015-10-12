module.exports = function(grunt) {

  'use strict';

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');
  var credentials = grunt.file.readJSON('credentials.json');

  grunt.initConfig({

    pkg: pkg,
    credentials: credentials,

    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= pkg.config.src %>/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
      styles: {
        files: ['<%= pkg.config.src %>/{,*/}*.css']
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true,
        watchOptions: {
          ignored: ''
        }
      },
      livereload: {
        options: {
          files: [
            '<%= pkg.config.src %>/{,*/}*.html',
            '.tmp/{,*/}*.css',
            '<%= pkg.config.src %>/{,*/}*'
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', pkg.config.src]
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%= pkg.config.dist %>'
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= pkg.config.dist %>/*',
            '!<%= pkg.config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    eslint: {
      target: [
        'Gruntfile.js'
      ]
    },

    sass: {
      options: {
        includePaths: ['.']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= pkg.config.src %>',
          src: '{,*/}*.{scss,sass}',
          dest: '.tmp',
          ext: '.css'
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= pkg.config.src %>',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= pkg.config.dist %>'
        }]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= pkg.config.src %>',
          src: '{,*/}*.css',
          dest: '.tmp'
        }, {
          expand: true,
          cwd: '<%= pkg.config.src %>',
          src: '*.html',
          dest: '.tmp'
        }]
      },
      cdn: {
        files: [{
          expand: true,
          cwd: '<%= pkg.config.dist %>',
          src: ['*.inline.html'],
          dest: '<%= pkg.config.dist %>',
          ext: '.cdn.html'
        }]
      }
    },

    uncss: {
      dist: {
        options: {
          report: 'min'
        },
        files: {
          '<%= pkg.config.dist %>/email.css': ['.tmp/*.html']
        }
      }
    },

    processhtml: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['*.html'],
          dest: '<%= pkg.config.dist %>'
        }]
      }
    },

    premailer: {
      dist: {
        options: {
          verbose: true
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.config.dist %>',
          src: ['*.html'],
          dest: '<%= pkg.config.dist %>',
          ext: '.inline.html'
        }]
      }
    },

    concurrent: {
      server: [
        'sass'
      ],
      dist: [
        'sass',
        'imagemin'
      ]
    },

    aws_s3: {
      options: {
        accessKeyId: '<%= credentials.s3.key %>',
        secretAccessKey: '<%= credentials.s3.secret %>',
        region: '<%= credentials.s3.region %>',
        uploadConcurrency: 5,
        downloadConcurrency: 5
      },
      dist: {
        options: {
          bucket: '<%= credentials.s3.bucketname %>',
          differential: true,
          params: {
            CacheControl: '2000'
          }
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.config.dist %>',
          src: '**',
          dest: '<%= credentials.s3.bucketdir %>'
        }]
      }
    },

    cdn: {
      options: {
        cdn: '<%= credentials.s3.bucketuri %>/<%= credentials.s3.bucketname %>/<%= credentials.s3.bucketdir %>/',
        flatten: true,
        supportedTypes: 'html'
      },
      dist: {
        cwd: '<%= pkg.config.dist %>',
        dest: '<%= pkg.config.dist %>',
        src: ['*.cdn.html']
      }
    },

    mailgun: {
      dist: {
        options: {
          key: '<%= credentials.mailgun.api_key %>',
          sender: '<%= credentials.mailgun.sender %>',
          recipient: '<%= credentials.mailgun.recipient %>',
          subject: 'Email test',
          preventThreading: true,
          hideRecipient: true
        },
        src: ['<%= pkg.config.dist %>/*.cdn.html']
      }
    }

  });

  grunt.registerTask('serve', 'start the server and preview your email', function () {
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'copy:dist',
    'uncss',
    'processhtml',
    'premailer'
  ]);

  grunt.registerTask('upload', [
    'default',
    'copy:cdn',
    'cdn',
    'aws_s3'
  ]);

  grunt.registerTask('send', 'send a test email', function () {
    grunt.task.run([
      'upload',
      'mailgun:dist'
    ]);
  });

  grunt.registerTask('default', [
    'eslint',
    'build'
  ]);

};
