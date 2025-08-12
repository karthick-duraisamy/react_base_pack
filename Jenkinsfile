pipeline {
    agent any
    options {
        disableConcurrentBuilds()
    }
    parameters {
        choice(
            choices: ['ADOBuild' , 'ADORevert'],
            description: '',
            name: 'REQUESTED_ACTION')
    }

    environment {
        ENVEXECFILE = "http://192.168.1.140:3000/INFINITI/flight_disruption.git"
        ENVDELFILE = ""
        GITEAURL = "http://192.168.1.140:3000/INFINITI/flight_disruption.git/commit"
        USERNAME_PASSWORD = credentials("0e3b896a-8542-487b-ad04-2ba5d47c3ce8")
        MYSQL_CREDENTIALS = credentials("4859d2d7-60a2-43c8-bffa-0e0d8566eaf6")
        PRODUCT_NAME = "Airline Distribution Optimizer"
        REPOSITORY_NAME = "GRM_Flight_Disruption_Management"
        SERVER_IP = "15.206.193.68"
        SERVER_NAME = "AD_DEV_SERVER"
        SERVER_FOLDER_PATH = "/home/Staging/ADO_DEV"
        DOCSTRING=""
    }
    stages {
         stage('RevertADOBuild') {
           when {
                beforeInput true
                expression { params.REQUESTED_ACTION == 'ADORevert' }
            }
           input {
                message 'Please enter build number to revert ADO React build ?'
                parameters {
                    string(name: 'angularrevertbuild_number', defaultValue: '', description: 'Enter your Job build number to revert angular build ?')
                }
            }


            steps {
                wrap([$class: 'BuildUser']) {
                    echo 'Building Zip files..'
                    script {
                        if (env.angularrevertbuild_number) {
                            echo "angularrevertbuild_number is the ${angularrevertbuild_number}"
                        }
                    }

                    sh '''
                        echo "sudo cd /home/Staging/ADO_DEV" > angularrevertscript_$BUILD_NUMBER.sh
                        echo "sudo cp -R ado_dev ado_dev_$BUILD_NUMBER" >> angularrevertscript_$BUILD_NUMBER.sh
                        echo "sudo rm -rf ado_dev" >> angularrevertscript_$BUILD_NUMBER.sh
                        echo "sudo cp -R ado_dev_${angularrevertbuild_number} ado_dev" >> angularrevertscript_$BUILD_NUMBER.sh


                        mkdir -p angularrevert
                        sudo chmod -R 777 angularrevert
                        sudo mv angularrevertscript_$BUILD_NUMBER.sh angularrevert/angularrevertscript_$BUILD_NUMBER.sh
                        sudo chmod -R 777 angularrevert     
                        #make zip file to execute in server
                        cd angularrevert
                        sudo zip -r angularrevertjob_$BUILD_NUMBER.zip angularrevertscript_$BUILD_NUMBER.sh
                        sudo rm -f angularrevertscript_$BUILD_NUMBER.sh

                        '''
                }
            }
        }

stage('ADO React Build Code') {
                  when {
                beforeInput true
                expression { params.REQUESTED_ACTION == 'ADOBuild' }
            }
            input {
                message 'Do you want to build ADO React files? - (For Yes - enter "Y", No - enter "N")?'
                ok "Approve"
                parameters {
                    string(name: 'is_angularbuild_need', defaultValue: '', description: 'Enter your choice for react build ?')
                }
              }
            
            steps {
                wrap([$class: 'BuildUser']) {
                    echo 'Building Angular files..'
                    sh '''
                        #Take Angular Build
                        echo "$is_angularbuild_need"
                        if [ "$is_angularbuild_need" = "Y" ] || [ "$is_angularbuild_need" = "Yes" ] || [ "$is_angularbuild_need" = "y" ] ;
                        then
                            echo "" | sudo -s chmod -R 777 *
                            echo y | yarn install --ignore-engines
                            #echo y  | sudo -u jenkins yarn install
                            export NODE_OPTIONS="--max-old-space-size=8192"
                            yarn build 
                            cp -rp ../build .
                            tar -cJf build.tar.xz build
                            #make build directoy
                            mkdir -p $WORKSPACE/angularbuild
                            chmod -R 777 $WORKSPACE/angularbuild
                            mkdir -p /var/www/html/deployment/jobs/$JOB_NAME/$BUILD_NUMBER
                            chmod -R 777 /var/www/html/deployment/jobs/$JOB_NAME/$BUILD_NUMBER
                            cp build.tar.xz /var/www/html/deployment/jobs/$JOB_NAME/$BUILD_NUMBER/build.tar.xz
                            cp build.tar.xz angularbuild/build.tar.xz
                        fi
                        '''
               }
            }
        } 
      
         stage('Revert to previous ADO React Build') {
          when {
                beforeInput true
                expression { params.REQUESTED_ACTION == 'ADORevert' }
            }


        input {
                message 'Do you want to revert previous MailTemplate React build to server? - (For Yes - enter "Y", No - enter "N")? Kindly approve the revert?'
                ok "Approve"
                parameters {
                    string(name: 'is_angularrevert_need', defaultValue: '', description: 'Enter your choice for build ?')  
 
                }
                submitter "balaji,kaviyarasan,pradeep"
                submitterParameter 'approved_user' 
                
            }
            
            steps('Revert previous angular build to server') {
                wrap([$class: 'BuildUser']) {
                       script {
                        if (env.is_angularrevert_need == 'Y' || env.is_angularrevert_need == 'y' || env.is_angularrevert_need == 'Yes') {
                        sshPublisher(
                            publishers: [
                                sshPublisherDesc(
                                    configName: 'AD_DEV_SERVER', 
                                    transfers: [
                                        sshTransfer(
                                            cleanRemote: false,
                                            excludes: '', 
                                            execCommand: 'cd /home/Staging/ADO_DEV && unzip -o angularrevertjob_$BUILD_NUMBER.zip && rm -f angularrevertjob_$BUILD_NUMBER.zip.zip && sudo chmod 777 angularrevertscript_$BUILD_NUMBER.sh && sh angularrevertscript_$BUILD_NUMBER.sh && rm -f *.zip && rm -f angularrevertscript_$BUILD_NUMBER.sh && sudo chmod -R 777 *', 
                                            execTimeout: 30000, 
                                            flatten: false, 
                                            makeEmptyDirs: false, 
                                            noDefaultExcludes: false, 
                                            patternSeparator: '[, ]+', 
                                            remoteDirectory: '//home/Staging/ADO_DEV/', 
                                            remoteDirectorySDF: false, 
                                            removePrefix: 'angularrevert', 
                                            sourceFiles: 'angularrevert/angularrevertjob_$BUILD_NUMBER.zip'
                                        )
                                    ], 
                                    usePromotionTimestamp: false, 
                                    useWorkspaceInPromotion: false, 
                                    verbose: true
                                )
                            ]
                        )
                    }
                }
	        }
        }
    }
               stage('Build & Move ADO React code') {
          when {
                beforeInput true
                expression { params.REQUESTED_ACTION == 'ADOBuild' }
            }
            input {
                message 'Do you want move the ADO react build files? - (For Yes - enter "Y", No - enter "N")? Kindly approve the file movement?'
                ok "Approve"
                parameters {
                    string(name: 'is_build_need', defaultValue: '', description: 'Enter your choice for angular build ?')   
                }
                submitter "balaji,kaviyarasan,pradeep"
                submitterParameter 'approved_user' 
            }
            
            steps {
                wrap([$class: 'BuildUser']) {
                    echo 'Building Angular files..'
                    script {
                        if (env.is_build_need == 'Y' || env.is_build_need == 'y' || env.is_build_need == 'Yes') { 
                            sshPublisher(
                                publishers: [
                                    sshPublisherDesc(
                                        configName: 'AD_DEV_SERVER', 
                                        transfers: [
                                            sshTransfer(
                                                cleanRemote: false,
                                                excludes: '', 
                                                execCommand: 'cd /home/Staging/ADO_DEV && mv ado_dev ado_dev_$BUILD_NUMBER && tar xf build.tar.xz && mv build ado_dev && sudo chmod -R 777 /home/Staging/ADO_DEV/ado_dev', 
                                                execTimeout: 30000, 
                                                flatten: false, 
                                                makeEmptyDirs: false, 
                                                noDefaultExcludes: false, 
                                                patternSeparator: '[, ]+', 
                                                remoteDirectory: '//home/Staging/ADO_DEV/', 
                                                remoteDirectorySDF: false, 
                                                removePrefix: 'angularbuild', 
                                                sourceFiles: 'angularbuild/build.tar.xz'
                                            )
                                        ], 
                                        usePromotionTimestamp: false, 
                                        useWorkspaceInPromotion: false, 
                                        verbose: true
                                    )
                                ]
                            )
                        }
                    }
                }
            }
        }
    }    
    post { 
        always {
          script {
            if (env.REQUESTED_ACTION == 'ADOBuild') {
            sh '''
            QUERYSTRING=""
            RESULT=`curl -X GET "http://localhost/deployment/api.php?JOB_NAME=$JOB_NAME&JOB_ID=$BUILD_NUMBER"`
            QUERYSTRING="UPDATE jenkins_deployment_data SET job_status='$RESULT',approved_by='$approved_by',approved_datetime = '$approved_date' WHERE job_id = '${BUILD_NUMBER}' AND job_name = '${JOB_NAME}';"
            NOW=`date "+%Y_%m_%d_%H_%M_%S"`

            '''

            echo "Final Output --> ${currentBuild.result}"
           }
          else {
           echo 'Files reverted'
           }
           }
        }
    }
}