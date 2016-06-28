/*
*Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
*WSO2 Inc. licenses this file to you under the Apache License,
*Version 2.0 (the "License"); you may not use this file except
*in compliance with the License.
*You may obtain a copy of the License at
*
*http://www.apache.org/licenses/LICENSE-2.0
*
*Unless required by applicable law or agreed to in writing,
*software distributed under the License is distributed on an
*"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
*KIND, either express or implied.  See the License for the
*specific language governing permissions and limitations
*under the License.
*/

package org.wso2.appmanager.integration.restapi.testcases;


import org.testng.annotations.*;
import org.wso2.appmanager.integration.restapi.RESTAPITestConstants;
import org.wso2.appmanager.integration.restapi.utils.RESTAPITestUtil;
import org.wso2.appmanager.integration.utils.restapi.base.AppMIntegrationBaseTest;
import org.wso2.carbon.automation.engine.annotations.ExecutionEnvironment;
import org.wso2.carbon.automation.engine.annotations.SetEnvironment;
import org.wso2.carbon.automation.engine.context.TestUserMode;
import org.wso2.carbon.integration.common.utils.mgt.ServerConfigurationManager;

import java.io.File;

import static org.testng.Assert.assertTrue;

@SetEnvironment(executionEnvironments = {ExecutionEnvironment.STANDALONE})
public class MobileAppTestCase extends AppMIntegrationBaseTest {
    ServerConfigurationManager serverConfigurationManager;

    @Factory(dataProvider = "userModeDataProvider")
    public MobileAppTestCase(TestUserMode userMode) {
        this.userMode = userMode;
    }

    @DataProvider
    public static Object[][] userModeDataProvider() {
        return new Object[][]{
                new Object[]{TestUserMode.SUPER_TENANT_ADMIN}
        };
    }

    @BeforeClass(alwaysRun = true)
    public void setEnvironment() throws Exception {
        super.init(userMode);
        if (TestUserMode.SUPER_TENANT_ADMIN == userMode) {
            serverConfigurationManager = new ServerConfigurationManager(gatewayContextWrk);
            serverConfigurationManager.restartGracefully();
        }
    }

    @Test(groups = {"wso2.appm"}, description = "REST API Implementation test : MobileApp test case")
    public void testRole() {

        String gatewayURL = getGatewayURLNhttp();
        String keyManagerURL = getKeyManagerURLHttp();

        //file name of the JSON data file related to : API lifecycle change test case
        String dataFileName = "publisher" + File.separator + "MobileAppTestCase.txt";
        String dataFilePath = (new File(System.getProperty("user.dir"))).getParent() +
                RESTAPITestConstants.PATH_SUBSTRING + dataFileName;
        boolean testSuccessStatus = new RESTAPITestUtil().testRestAPI(dataFilePath, gatewayURL, keyManagerURL);
        assertTrue(testSuccessStatus);
    }

    @AfterClass(alwaysRun = true)
    public void destroy() throws Exception {
        //super.cleanUp();
        if (TestUserMode.SUPER_TENANT_ADMIN == userMode) {
            serverConfigurationManager.restoreToLastConfiguration();
        }
    }
}