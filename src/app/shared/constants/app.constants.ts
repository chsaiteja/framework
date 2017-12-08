/** Below are the variables used as constants */
export let sectionsArr = [];

export const questionsArr = [
        { section: 'CareerGoals', questions: ['What are your career goals?'] },
        {
                section: 'EducationPlans', questions: ['What are your educational plans after high school?',
                        'What other educational plans do you have?']
        },
        { section: 'CareerCluster', questions: ['What career clusters interest you?'] },
        { section: 'GraduationRequirements', questions: ['Enter your planned and completed credits.'] },
        { section: 'TestScores', questions: ['Enter up to 6 test names with test scores.'] },
        { section: 'ActionPlan', questions: ['What is your action plan for this year?'] },
        { section: 'SupportNetwork', questions: ['Who will encourage and support you to achieve your goals?'] }
];


export const educationFieldsArr = [
        { label: `Bachelor's degree (4 years)`, value: 'BD', selected: false },
        { label: 'Associate degree (2 years)', value: 'AD', selected: false },
        { label: 'Certificate', value: 'Cer', selected: false },
        { label: 'Apprenticeship', value: 'App', selected: false },
        { label: 'Military', value: 'Mil', selected: false },
        { label: 'Employment', value: 'Emp', selected: false },
        { label: 'No plan at this time', value: 'None', selected: false },
        { label: 'Other', value: 'other', selected: false }
];

export const EndUrlArr = [
        { section: 'NewPassword', endUrl: 'PasswordReset', tokenUrl: 'PasswordResetTokenValid' },
        { section: 'UsernameRecovery', endUrl: 'UsernameRecovery' },
        { section: 'PasswordRecovery', endUrl: 'PasswordResetSendEmail' },
        { section: 'PersonalInfo', endUrl: 'Account' },
        { section: 'CareerGoals', endUrl: 'Reflection', fieldName: 'CareerGoals' },
        { section: 'EducationPlans', endUrl: 'Reflection', fieldNameCheck: 'PSPlansList', fieldNameRef: 'PSPlans' },
        { section: 'CareerAssessments', endUrl: 'SavedAnswers', fieldName: '' },
        { section: 'CareerCluster', endUrl: 'Reflection', fieldName: 'CareerFields', secondRef: 'OccClusters' },
        { section: 'OccAndCluster', endUrl: 'SavedFiles', fileName: 'Occ' },
        { section: 'CoursePlan', endUrl: 'CoursePlan' },
        { section: 'GraduationRequirements', endUrl: 'GraduationRequirements' },
        { section: 'TestScores', endUrl: 'TestScores' },
        { section: 'StudyOfInterest', endUrl: 'SavedFiles', fileName: 'Prog' },
        { section: 'SchoolsOfInterest', endUrl: 'SavedFiles', fileName: 'NSch' },
        { section: 'VolunteerCommunityService', endUrl: 'VolunteerExperiences' },
        { section: 'ExtraActivities', endUrl: 'Extracurricular' },
        { section: 'EmploymentHistory', endUrl: 'Employment' },
        { section: 'ActionPlan', endUrl: 'Reflection', fieldName: 'ActionPlan' },
        { section: 'SupportNetwork', endUrl: 'Reflection', fieldName: 'Network' },
        { section: 'ExperientialLearning', endUrl: 'ExperientialLearning' },
        { section: 'CommentsAndSignature', endUrl: 'CommentsAndSig' }
];

export const returnUrl = {
        url: window.location.protocol + '//' + window.location.host + '/login/newPassword'
}

export const tableNoData = [
        {
                section: ['CareerAssessments', 'OccAndCluster', 'CoursePlan', 'StudyOfInterest', 'SchoolsOfInterest',
                        'ExtraActivities', 'EmploymentHistory', 'VolunteerCommunityService'], text: 'No information has been entered for this item.'
        }
];

export const ExperientialLearningArr = [
        {
                name: 'Expert Presenters', subName: 'ELExpert', subNameList: 'ELExpertList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: `Expert Presenters visit classrooms and share information about their careers, educational background and personal choices that helped them achieve their career success.`
        },
        {
                name: 'Tours and Field Trips', subName: 'ELTour', subNameList: 'ELTourList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Tours and Field Tripshelp students explore the knowledge and skills of different occupations within an industry cluster.'
        },
        {
                name: 'Entrepreneurship', subName: 'ELEpren', subNameList: 'ELEprenList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Entrepreneurship provides students with opportunities to demonstrate leadership and to learn about organizing and operating their own businesses or projects.'
        },
        {
                name: 'Community Based Learning', subName: 'ELCBLearn', subNameList: 'ELCBLearnList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Community-Based Learningexperiences are activities such as job shadowing, work site visits or field trips, work in a business, participation in a club or organization or work in a school based enterprise.'
        },
        {
                name: 'Work-based Learning', subName: 'ELWBLearn', subNameList: 'ELWBLearnList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Work-Based Learning occurs outside of the classroom. It involves learning experiences and activities that include paid or unpaid work experience such as structured cooperative work experiences, internships, and youth apprenticeship.'
        },
        {
                name: 'Job Shadowing', subName: 'ELShadow', subNameList: 'ELShadowList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Job Shadowing is a short-term experience intended to help students explore a range of career objectives.  Students make brief worksite visits to spend time with individual workers learning what knowledge, skills and education their jobs entail.'
        },
        {
                name: 'Service Learning', subName: 'ELService', subNameList: 'ELServiceList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Service Learning is a way of teaching and learning that engages all learners in hands-on projects in the community to meet learning objectives. This type of learning benefits students and strengthens communities.'
        },
        {
                name: 'Internships', subName: 'ELIntern', subNameList: 'ELInternList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Internships are short term work experiences but can last 40 hours or more. Interns work in professional settings under the supervision of professionals. In high school, internships must be supervised by a licensed work-based learning teacher.'
        },
        {
                name: 'Cooperative Education', subName: 'ELCoopEd', subNameList: 'ELCoopEdList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Cooperative Work Experience provides students with work experiences related to their major, career field or pathway goal. Students are involved in classroom study and discipline-related employment in order to gain career related work experience before graduating.'
        },
        {
                name: 'Mentoring / eMentoring', subName: 'ELMentor', subNameList: 'ELMentorList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Mentoring / eMentoring is a professional relationship in which an experienced person (mentor) assists another (mentee) in developing skills and knowledge that will enhance the mentee’s professional and personal growth.'
        },
        {
                name: 'Youth Apprenticeship', subName: 'ELPreApp', subNameList: 'ELPreAppList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Youth Apprenticeship’s are paid experiences for 11th and 12th grade students. Youth Apprenticeship students must be supervised by a licensed work-based learning teacher in a state approved program. This type of apprenticeship requires a written agreement by all parties and a training plan.'
        },
        {
                name: 'Pre-Apprenticeship', subName: 'ELYouthApp', subNameList: 'ELYouthAppList',
                Myself: false, Careers: false, Future: false, Try: false,
                hoverText: 'Pre-Apprenticeship programs help prepare students to enter and succeed in a Registered Apprenticeship program.'
        }
];


export const successMessageArr = [
        {
                section: ['CareerGoals', 'EducationPlans', 'CareerCluster'
                        , 'ActionPlan', 'SupportNetwork', 'ExperientialLearning', 'PersonalInfo', 'TestScores', 'CommentsAndSignature'
                ], save: 'Your data has been successfully saved.', update: 'Data has been successfully updated', error: 'Saving failed.'
        },
];

export const routeConstants = [
        {
                module: 'plp', baseUrl: 'login', allowedRoutes: ['plpcontent']
        },
        {
                module: 'occsort', baseUrl: 'os', allowedRoutes: ['os', 'occsort']
        },
        {
                module: 'interestprofilersf', baseUrl: 'ip', allowedRoutes: ['ip', 'interestprofilersf']
        },
        {
                module: 'entrepreneurquiz', baseUrl: 'eq', allowedRoutes: ['eq', 'entrepreneurquiz']
        },
        {
                module: 'all', baseUrl: 'login',
                allowedRoutes: ['plpcontent', 'os', 'occsort', 'ip', 'interestprofilersf', 'eq', 'entrepreneurquiz']
        },
        {
                module: '', baseUrl: 'login',
                allowedRoutes: ['plpcontent', 'os', 'occsort', 'ip', 'interestprofilersf', 'eq', 'entrepreneurquiz']
        }

];


/** This variable is used for route configuration of lazy loaded modules and items used in each module.*/
export const routeObj = {
        plpPersonalInfo: {
                itemConfig: {
                        url: './personalInfo',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'personal-info',
                        section: 'PersonalInfo',
                        icon: 'icon-personal-info'
                },
                routeConfig: {
                        path: 'personalInfo',

                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/personal-info/personal-info.module').PersonalInfoModule);
                                })
                        })

                }
        },
        plpCareerGoals: {
                itemConfig: {
                        url: './careerGoals',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'career-goals',
                        section: 'CareerGoals',
                        icon: 'icon-career-goals'
                },
                routeConfig: {
                        path: 'careerGoals',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/career-goals/career-goals.module').CareerGoalsModule);
                                })
                        })

                }
        },
        plpEducationPlans: {
                itemConfig: {
                        url: './educationPlans',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'education-plans',
                        section: 'EducationPlans',
                        icon: 'icon-education-plans'
                },
                routeConfig: {
                        path: 'educationPlans',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/education-plans/education-plans.module').EducationPlansModule);
                                })
                        })
                }
        },
        plpActionPlan: {

                itemConfig: {
                        url: './actionPlan',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'action-plan',
                        section: 'ActionPlan',
                        icon: 'icon-action-plan'
                },
                routeConfig: {
                        path: 'actionPlan',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/action-plan-for-year/action-plan-for-year.module').ActionPlansModule);
                                })
                        })

                }
        },
        plpSortsAssessments: {
                itemConfig: {
                        url: './careerAssessment',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'self-knowledge-career-assess',
                        section: 'CareerAssessments',
                        icon: 'icon-self-knowledge-career-assessment'
                },
                routeConfig: {
                        path: 'careerAssessment',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/career-assessments/career-assessments.module').CareerAssessmentsModule);
                                })
                        })


                }
        },
        plpCareerClusters: {
                itemConfig: {
                        url: './careerCluster',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'career-clusters-interest',
                        section: 'CareerCluster',
                        icon: 'icon-career-clusters-interest'
                },
                routeConfig: {
                        path: 'careerCluster',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/career-cluster/career-cluster.module').CareerClusterModule);
                                })
                        })

                }
        },
        plpCommentsSign: {
                itemConfig: {
                        url: './commentsSignature',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'comments-sign',
                        section: 'CommentsAndSignature',
                        icon: 'icon-comments-sign'
                },
                routeConfig: {
                        path: 'commentsSignature',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/comments-and-signature/comments-and-signature.module').CommentsAndSignatureModule);
                                })
                        })

                }
        },
        plpCoursePlan: {
                itemConfig: {
                        url: './coursePlan',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'course-plan',
                        section: 'CoursePlan',
                        icon: 'icon-course-plan'
                },
                routeConfig: {
                        path: 'coursePlan',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/course-plan/course-plan.module').CoursePlanModule);
                                })
                        })

                }
        },
        plpEmploymentHistory: {
                itemConfig: {
                        url: './empHistory',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'employment-historyWork',
                        section: 'EmploymentHistory',
                        icon: 'icon-employment-history-work'
                },

                routeConfig: {
                        path: 'empHistory',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/employment-history/employment-history.module').EmploymentHistoryModule);
                                })
                        })

                }
        },
        plpExperientialLearning: {
                itemConfig: {
                        url: './expLearning',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'experiential-learning',
                        section: 'ExperientialLearning',
                        icon: 'icon-experiential-learning'
                },
                routeConfig: {
                        path: 'expLearning',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/experiential-learning/experiential-learning.module').ExperientialLearningModule);
                                })
                        })


                }
        },
        plpExtracurricularActivities: {
                itemConfig: {
                        url: './extraActivities',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'extracurricular-activities',
                        section: 'ExtraActivities',
                        icon: 'icon-extracurricular-activities'
                },
                routeConfig: {
                        path: 'extraActivities',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/extra-activities/extra-activities.module').ExtraActivitiesModule);
                                })
                        })

                }
        },
        plpGradRequirements: {
                itemConfig: {
                        url: './gradRequirement',
                        image: '/assets/images/.jpg',
                        color: '#0a8f72',
                        apiName: 'grad-requirement',
                        section: 'GraduationRequirements',
                        icon: 'icon-grad-requirement'
                },
                routeConfig: {
                        path: 'gradRequirement',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/graduation-requirements/graduation-requirements.module').GraduationRequirementsModule);
                                })
                        })

                }
        },
        plpOccsAndClusters: {
                itemConfig: {
                        url: './occCluster',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'occ-and-clusters-interest',
                        section: 'OccAndCluster',
                        icon: 'icon-occ-and-clusters-interest'
                },
                routeConfig: {
                        path: 'occCluster',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/occ-and-cluster/occ-and-cluster.module').OccAndClusterModule);
                                })
                        })


                }
        },
        plpPostsecondarySchools: {
                itemConfig: {
                        url: './schoolsOfInterest',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'postsecondary-schools',
                        section: 'SchoolsOfInterest',
                        icon: 'icon-postsecondary-schools'
                },
                routeConfig: {
                        path: 'schoolsOfInterest',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/schools-of-interest/schools-of-interest.module').SchoolsOfInterestModule);
                                })
                        })


                }
        },
        plpProgramsOfStudy: {
                itemConfig: {
                        url: './studyOfInterest',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'prog-of-study-of-interest',
                        section: 'StudyOfInterest',
                        icon: 'icon-prog-of-study-of-interest'
                },
                routeConfig: {
                        path: 'studyOfInterest',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/study-of-interest/study-of-interest.module').StudyOfInterestModule);
                                })
                        })


                }
        },
        plpSupportNetwork: {
                itemConfig: {
                        url: './supportNetwork',
                        image: '/assets/images/.jpg',
                        color: '#0a8f72',
                        apiName: 'support-network',
                        section: 'SupportNetwork',
                        icon: 'icon-support-network'
                },
                routeConfig: {
                        path: 'supportNetwork',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/support-network/support-network.module').SupportNetworkModule);
                                })
                        })

                }
        },
        plpTestScores: {
                itemConfig: {
                        url: './testScores',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'test-scores',
                        section: 'TestScores',
                        icon: 'icon-test-scores'
                },
                routeConfig: {
                        path: 'testScores',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/test-scores/test-scores.module').TestScoresModule);
                                })
                        })


                }
        },
        plpCommunityService: {
                itemConfig: {
                        url: './volunteerCommunity',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72',
                        apiName: 'volun-comm-service',
                        section: 'VolunteerCommunityService',
                        icon: 'icon-volun-comm-service'
                },
                routeConfig: {
                        path: 'volunteerCommunity',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/PLP/shared/volunteer-community-service/volunteer-community-service.module').VolunteerCommunityServiceModule);
                                })
                        })
                }
        },
        sortEntQuiz: {
                itemConfig: {
                        url: './entrepreneurQuiz/intro',
                        image: '/assets/images/enterpreneurial-icon.png',
                        color: '#0a8f72'
                },
                routeConfig: {
                        path: 'entrepreneurQuiz',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/entrepreneur-quiz/entquiz.module').EnterpreneurQuizModule);
                                })
                        })

                }
        },
        sortShortIP: {
                itemConfig: {
                        url: './interestProfilerSf/intro',
                        image: '/assets/images/Interest-Profiler-icon.png',
                        color: '#045978'
                },
                routeConfig: {
                        path: 'interestProfilerSf',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/interest-profiler-sf/interestProfilerSf.module').InterestProfilerShModule);
                                })
                        })
                }
        },
        sortOccSort: {
                itemConfig: {
                        url: './occSort/intro',
                        image: '/assets/images/Occupation-Sort-icon.png',
                        color: '#1198a7'
                },
                routeConfig: {
                        path: 'occSort',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/occ-sort/occsort.module').OccSortModule);
                                })
                        })
                }
        },
        sortCCIJr: {
                itemConfig: {
                        url: './cciJr/intro',
                        image: '/assets/images/cci-image.png',
                        color: '#de7c0a'
                },
                routeConfig: {
                        path: 'cciJr',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/career-cluster-inventory/career-cluster.module').CCIModule);
                                })
                        })
                }
        },
        sortCCIQuick: {
                itemConfig: {
                        url: './cciQuick/intro',
                        image: '/assets/images/baby_CCI.png',
                        color: '#06b0fe'
                },
                routeConfig: {
                        path: 'cciQuick',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/cci-quick/cci-quick.module').CCIModule);
                                })
                        })
                }
        },
        sortCCIAdult: {
                itemConfig: {
                        url: './cciAdult/intro',
                        image: '/assets/images/cci-image.png',
                        color: '#de7c0a'
                },
                routeConfig: {
                        path: 'cciAdult',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/career-cluster-inventory/career-cluster.module').CCIModule);
                                })
                        })
                }
        },
        sortLearnStyle: {
                itemConfig: {
                        url: './lssAsessment/intro',
                        image: '/assets/images/lss-image.png',
                        color: '#518ec4'
                },
                routeConfig: {
                        path: 'lssAsessment',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/learning-style-survey/learning-style.module').LSSModule);
                                })
                        })
                }
        },
        sortWES: {
                itemConfig: {
                        url: './wesAsessment/intro',
                        image: '/assets/images/wes-image.png',
                        color: '#6fa301'
                },
                routeConfig: {
                        path: 'wesAsessment',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/workplace-employability-skills/workplace-employability.module').WESModule);
                                })
                        })
                }
        },
        sortWIL: {
                itemConfig: {
                        url: './wilAsessment/intro',
                        image: '/assets/images/wil-image.png',
                        color: '#a80067'
                },
                routeConfig: {
                        path: 'wilAsessment',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/work-importance-locator/work-importance.module').WILModule);
                                })
                        })
                }
        },

        sortAE: {
                itemConfig: {
                        url: './abilityexplorerAssessment/intro',
                        image: '/assets/images/ability-landing.png',
                        color: '#4cb050'
                },
                routeConfig: {
                        path: 'abilityexplorerAssessment',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/ability-explorer/ability-explorer.module').AbilityModule);
                                })
                        })
                }
        },
        sortIDEAS: {
                itemConfig: {
                        url: './ideasAssessment/intro',
                        image: '/assets/images/ideas-image.png',
                        color: '#AB47BC'
                },
                routeConfig: {
                        path: 'ideasAssessment',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/assessments/ideas/ideas-module').IdeasModule);
                                })
                        })
                }
        },
        fileOcc: {
                itemConfig: {
                        url: './occdetails/occIndex',
                        image: '/assets/images/occcareers.png',
                        color: '#dd6f6e'
                },
                routeConfig: {
                        path: 'occdetails',
                        loadChildren: () => new Promise(resolve => {
                                (require as any).ensure([], require => {
                                        resolve(require('app/modules/occ-details/occ-details-module').OccDetailModule);
                                })
                        })

                }
        }

};

export const langData = {}