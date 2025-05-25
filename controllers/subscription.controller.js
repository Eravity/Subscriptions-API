import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      // Any data from subscription body + user id to know which user created it
      ...req.body, 
      user: req.user._id, 
    })

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });

  } catch (error) {
    next(error);
  }
}

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find()

    res.status(200).json({
      success: true,
      message: 'Subscriptions fetched successfully',
      data: subscriptions,
    });

  } catch (error) {
    next(error);
  }
}

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Subscription details fetched successfully',
      data: subscription,
    });

  } catch (error) {
    next(error);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User subscriptions fetched successfully',
      data: subscriptions,
    });

  } catch (error) {
    next(error);
  }
}

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const upcomingRenewals = await Subscription.find({
      renewalDate: { $gte: today }
    });

    res.status(200).json({
      success: true,
      message: 'Upcoming renewals fetched successfully',
      data: upcomingRenewals,
    });

  } catch (error) {
    next(error);
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: subscription,
    });

  } catch (error) {
    next(error);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
     const subscription = await Subscription.findByIdAndUpdate(
       req.params.id,
       req.body,
       { new: true, runValidators: true }
     );

     if (!subscription) {
       const error = new Error('Subscription not found');
       error.statusCode = 404;
       throw error;
     }

     res.status(200).json({
       success: true,
       message: 'Subscription updated successfully',
       data: subscription,
     });

  } catch (error) {
    next(error);
  }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Logic to cancel the subscription (e.g., update status)
    subscription.status = 'canceled';
    subscription.renewalDate = null; 

    await subscription.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    });

  } catch (error) {
    next(error);
  }
}