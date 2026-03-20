# User Guide 📖

Complete guide for using the AutoInsight ML Engine platform.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Data Management](#data-management)
4. [Model Training](#model-training)
5. [Making Predictions](#making-predictions)
6. [Analytics & Visualizations](#analytics--visualizations)
7. [Settings & Profile](#settings--profile)
8. [Tips & Best Practices](#tips--best-practices)

## Getting Started 🚀

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid user account

### Accessing the Platform
1. Open your web browser
2. Navigate to the application URL (e.g., `http://localhost:5173`)
3. Log in with your credentials or register a new account

### First Login
The platform provides a default admin account for immediate access:
- **Email**: `admin@local`
- **Password**: `admin`

## Authentication 🔐

### Creating an Account
1. Click **"Sign up"** on the login page
2. Fill in the registration form:
   - **Full Name**: Your complete name
   - **Email**: Valid email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Re-enter your password
3. Click **"Create Account"**
4. You'll be redirected to login after successful registration

### Logging In
1. Enter your email and password
2. Click **"Sign In"**
3. Successful login redirects you to the dashboard
4. Your session remains active until you log out

### Managing Your Profile
Access your profile settings by:
1. Clicking your profile avatar in the top-right
2. Selecting **"Settings"** from the dropdown
3. Or navigating directly to `/settings`

#### Profile Tab
- **Full Name**: Update your display name
- **Email**: Change your email address
- **Organization**: Add your company/organization
- **Role**: Specify your job role

#### Security Tab
- **Current Password**: Required for security changes
- **New Password**: Set a new password (6+ characters)
- **Confirm Password**: Verify the new password

### Logging Out
1. Go to **Settings** → **Security** tab
2. Click the **"Logout"** button
3. Or use the logout option in the profile dropdown

## Data Management 📊

### Uploading Data

#### Supported Formats
- **CSV** (.csv) - Comma-separated values
- **Excel** (.xlsx, .xls) - Microsoft Excel files
- **Maximum file size**: 100MB

#### Upload Steps
1. Navigate to **Data Upload** (`/data/upload`)
2. **Drag and drop** your file onto the upload area, or
3. **Click to browse** and select your file
4. Wait for the upload to complete
5. Preview your data structure

#### Data Preview
After upload, you'll see:
- **File information**: Name, size, upload date
- **Column overview**: All columns with data types
- **Sample data**: First 10 rows of your dataset
- **Statistics**: Row count, column types, missing values

### Data Validation
The platform automatically validates your data:
- ✅ **Required columns**: No empty column names
- ✅ **Data types**: Automatic type detection
- ✅ **Encoding**: UTF-8 support
- ⚠️ **Issues**: Missing values, inconsistent formats

### Managing Datasets
- **View all datasets**: Access through sidebar navigation
- **Delete datasets**: Remove unwanted files
- **Download results**: Export processed data

## Model Training 🤖

### Preparing for Training

#### Select Target Column
1. Choose the column you want to predict
2. The target column should contain:
   - **Classification**: Categories or classes
   - **Regression**: Numeric values
   - **Clustering**: No target needed

#### Algorithm Selection
The platform offers multiple algorithms:

**Classification Models:**
- **Random Forest**: Good for most classification tasks
- **Logistic Regression**: Simple, interpretable
- **SVM**: Works well with clear margins
- **XGBoost**: High performance, handles complex patterns

**Regression Models:**
- **Linear Regression**: Basic regression
- **Random Forest Regressor**: Non-linear patterns
- **XGBoost Regressor**: Advanced regression
- **SVR**: Support Vector Regression

**Clustering Models:**
- **K-Means**: Distance-based clustering
- **DBSCAN**: Density-based clustering
- **Hierarchical**: Tree-based clustering

### Training Process

#### Basic Training
1. Navigate to **Model Training** (`/model/training`)
2. Select your uploaded dataset
3. Choose the target column
4. Select algorithm or use **"Auto Recommend"**
5. Click **"Train Model"**

#### Advanced Configuration
For more control, expand **"Advanced Settings"**:
- **Test Size**: Proportion for testing (default: 20%)
- **Random State**: Reproducibility (default: 42)
- **Hyperparameters**: Algorithm-specific settings

#### Training Progress
During training, you'll see:
- **Progress bar**: Training completion percentage
- **Time elapsed**: Current training duration
- **Status updates**: Real-time progress information

### Understanding Results

#### Performance Metrics
**Classification:**
- **Accuracy**: Overall correctness
- **Precision**: True positive rate
- **Recall**: Sensitivity
- **F1 Score**: Balance of precision and recall
- **Confusion Matrix**: Detailed performance breakdown

**Regression:**
- **R² Score**: Explained variance
- **MAE**: Mean Absolute Error
- **MSE**: Mean Squared Error
- **RMSE**: Root Mean Squared Error

#### Feature Importance
- **Bar chart**: Most important features
- **Percentage values**: Relative importance
- **Insights**: What drives predictions

#### Model Details
- **Algorithm used**: Type of model
- **Training time**: How long it took
- **Dataset info**: Data used for training
- **Model ID**: Unique identifier

## Making Predictions 📈

### Single Predictions

#### When to Use
- Test individual cases
- Real-time predictions
- What-if scenarios

#### Steps
1. Navigate to **Single Prediction** (`/prediction/single`)
2. Select your trained model
3. Fill in the input fields:
   - **Numeric fields**: Enter numbers
   - **Categorical fields**: Select from dropdown
   - **Boolean fields**: Toggle yes/no
4. Click **"Predict"**

#### Results
- **Prediction**: The model's output
- **Confidence**: How sure the model is (0-100%)
- **Probabilities**: Likelihood for each class (classification)
- **Processing time**: How long the prediction took

### Batch Predictions

#### When to Use
- Multiple predictions at once
- Processing existing datasets
- Bulk operations

#### Steps
1. Navigate to **Batch Prediction** (`/prediction/batch`)
2. Select your trained model
3. Upload a CSV file with the same columns as training data
4. Click **"Process Predictions"**
5. Download the results file

#### Results Format
The output file includes:
- **Original data**: Your input data
- **Prediction**: Model's output
- **Confidence**: Prediction confidence
- **Timestamp**: When prediction was made

### Prediction History
- **Access**: Through **Analytics** → **Prediction History**
- **Filter**: By date, model, or confidence
- **Export**: Download history as CSV
- **Details**: View individual predictions

## Analytics & Visualizations 📊

### Dashboard Overview
The main dashboard provides:
- **Model count**: Total trained models
- **Recent predictions**: Latest prediction activities
- **Performance metrics**: Overall system health
- **Quick actions**: Easy access to common tasks

### Data Visualizations

#### Histograms
**Purpose**: Understand feature distributions
- **X-axis**: Feature values
- **Y-axis**: Frequency/count
- **Insights**: Data spread, outliers, patterns

#### Correlation Matrix
**Purpose**: See relationships between features
- **Colors**: Red (positive) to Blue (negative)
- **Values**: Correlation coefficients (-1 to 1)
- **Use**: Feature selection, multicollinearity

#### Feature Importance
**Purpose**: Understand what drives predictions
- **Horizontal bars**: Most to least important
- **Percentages**: Relative importance
- **Action**: Feature engineering insights

### Model Analytics

#### Performance Trends
- **Accuracy over time**: Model improvement
- **Prediction volume**: Usage patterns
- **Error rates**: Quality monitoring

#### Comparison Tools
- **Model comparison**: Side-by-side metrics
- **Algorithm performance**: Best algorithm selection
- **Cross-validation**: Robustness testing

### Recommendations Engine

#### Smart Suggestions
The AI recommends:
- **Best algorithms**: Based on your data
- **Feature engineering**: Data improvements
- **Visualization types**: Most relevant charts
- **Preprocessing steps**: Data cleaning needs

#### Implementation Tips
- **Follow recommendations**: For better results
- **Experiment**: Try different suggestions
- **Track performance**: Measure improvements

## Settings & Profile ⚙️

### Profile Management
Keep your information up-to-date:
- **Personal details**: Name, email, organization
- **Preferences**: Notification settings
- **Security**: Password management

### Notification Preferences
Choose what updates you receive:
- **Training Complete**: When models finish training
- **Model Drift Alert**: Performance degradation
- **High Error Rate**: System issues
- **New Data Upload**: File upload notifications

### Appearance Settings
Customize your experience:
- **Theme**: Light/Dark/System default
- **Language**: Interface language
- **Time zone**: Display preferences

### Security Best Practices
- **Strong passwords**: 6+ characters, mixed types
- **Regular updates**: Change passwords periodically
- **Logout**: Sign out when finished
- **Secure connection**: Use HTTPS in production

## Tips & Best Practices 💡

### Data Preparation
- **Clean data**: Remove obvious errors
- **Consistent formats**: Standardize date/time formats
- **Handle missing values**: Impute or remove
- **Feature engineering**: Create meaningful features

### Model Training
- **Start simple**: Try basic algorithms first
- **Cross-validation**: Ensure robust performance
- **Hyperparameter tuning**: Optimize model settings
- **Multiple models**: Compare different approaches

### Prediction Accuracy
- **Quality data**: Better data = better predictions
- **Feature relevance**: Use important features only
- **Model selection**: Choose the right algorithm
- **Validation**: Test on unseen data

### Performance Optimization
- **Batch operations**: Process multiple items together
- **Model caching**: Save trained models
- **Data sampling**: Use subsets for testing
- **Resource monitoring**: Track system usage

### Common Issues & Solutions

#### Upload Problems
- **File size**: Keep files under 100MB
- **Format**: Use CSV or Excel formats
- **Encoding**: Save as UTF-8
- **Headers**: Ensure clear column names

#### Training Issues
- **Memory usage**: Large datasets may need sampling
- **Target column**: Must be present and valid
- **Data types**: Check for mixed types in columns
- **Missing values**: Handle before training

#### Prediction Problems
- **Feature mismatch**: Prediction data must match training data
- **Model selection**: Use appropriate model for your task
- **Confidence**: Low confidence may indicate issues
- **Data quality**: Poor input leads to poor output

### Getting Help
- **Documentation**: Check this guide first
- **API docs**: Technical reference at `/docs`
- **Support**: Contact your system administrator
- **Community**: Join user forums for tips

---

## Keyboard Shortcuts ⌨️

| Action | Shortcut |
|--------|----------|
| Navigate to Dashboard | Ctrl + D |
| Upload Data | Ctrl + U |
| Train Model | Ctrl + T |
| Make Prediction | Ctrl + P |
| Open Settings | Ctrl + , |
| Logout | Ctrl + L |

## Mobile Usage 📱

The platform is fully responsive:
- **Touch-friendly**: Large tap targets
- **Swipe gestures**: Navigate between sections
- **Offline mode**: Limited functionality without internet
- **Push notifications**: Available on supported devices

---

Happy modeling! 🎉

For technical support or feature requests, please contact your system administrator.
